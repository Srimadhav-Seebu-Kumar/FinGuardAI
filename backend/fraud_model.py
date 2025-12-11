import os
from typing import Optional, Dict, Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import roc_auc_score, classification_report

from data_processing import (
    feature_engineering,
    build_feature_target,
    create_preprocessor,
    split_xy,
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

RF_PATH = os.path.join(MODEL_DIR, "rf_model.pkl")
IFOREST_PATH = os.path.join(MODEL_DIR, "iforest_model.pkl")
PREP_PATH = os.path.join(MODEL_DIR, "preprocessor.pkl")


class FraudDetector:
    def __init__(self):
        self.rf: Optional[RandomForestClassifier] = None
        self.iforest: Optional[IsolationForest] = None
        self.preprocessor = None

    # ------------ TRAINING ------------

    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        df_fe = feature_engineering(df)
        X, y, num_cols, cat_cols = build_feature_target(df_fe)

        preprocessor = create_preprocessor(num_cols, cat_cols)
        X_processed = preprocessor.fit_transform(X)
        joblib.dump(preprocessor, PREP_PATH)
        self.preprocessor = preprocessor

        metrics: Dict[str, Any] = {}

        # supervised
        if y is not None:
            X_train, X_test, y_train, y_test = split_xy(X, y)
            X_train_p = preprocessor.transform(X_train)
            X_test_p = preprocessor.transform(X_test)

            rf = RandomForestClassifier(
                n_estimators=250,
                max_depth=None,
                class_weight="balanced",
                n_jobs=-1,
                random_state=42,
            )
            rf.fit(X_train_p, y_train)
            y_proba = rf.predict_proba(X_test_p)[:, 1]
            auc = roc_auc_score(y_test, y_proba)

            metrics["roc_auc"] = float(auc)
            metrics["report"] = classification_report(
                y_test, (y_proba > 0.5).astype(int), output_dict=True
            )

            joblib.dump(rf, RF_PATH)
            self.rf = rf

        # unsupervised
        iforest = IsolationForest(
            n_estimators=200,
            contamination=0.05,
            n_jobs=-1,
            random_state=42,
        )
        iforest.fit(X_processed)
        joblib.dump(iforest, IFOREST_PATH)
        self.iforest = iforest

        return metrics

    # ------------ LOAD ------------

    def load(self):
        if os.path.exists(PREP_PATH):
            self.preprocessor = joblib.load(PREP_PATH)
        if os.path.exists(RF_PATH):
            self.rf = joblib.load(RF_PATH)
        if os.path.exists(IFOREST_PATH):
            self.iforest = joblib.load(IFOREST_PATH)

    # ------------ REASONING TAGS ------------

    def _reason_codes(self, row: pd.Series) -> str:
        reasons = []

        amt = row.get("amount", 0)
        amt_vs_avg = row.get("amount_vs_user_avg", 1)
        is_night = row.get("is_night", 0)
        merchant = str(row.get("merchant_category", "")).lower()
        channel = str(row.get("channel", "")).lower()
        loc = str(row.get("location", "")).lower()

        if amt > 3000:
            reasons.append("High Ticket Amount")
        if amt_vs_avg > 5:
            reasons.append("Spike vs User History")
        if is_night == 1:
            reasons.append("Night-time Transaction")
        if "crypto" in merchant:
            reasons.append("Crypto Merchant")
        if "vpn" in merchant:
            reasons.append("VPN / Proxy Service")
        if "web" in channel and "new" in loc:
            reasons.append("New Geo over Web")

        if not reasons:
            reasons.append("Model-Driven Risk")

        return ", ".join(reasons)

    # ------------ SCORE ------------

    def score(self, df: pd.DataFrame) -> pd.DataFrame:
        if self.preprocessor is None:
            raise RuntimeError("Model not trained. Call train() first.")

        df_fe = feature_engineering(df)
        X, _, _, _ = build_feature_target(df_fe)
        X_proc = self.preprocessor.transform(X)

        out = df.copy()

        if self.rf is not None:
            proba = self.rf.predict_proba(X_proc)[:, 1]
            out["fraud_probability"] = proba
        else:
            out["fraud_probability"] = np.nan

        if self.iforest is not None:
            # higher = more anomalous
            score = -self.iforest.decision_function(X_proc)
            out["anomaly_score"] = score
        else:
            out["anomaly_score"] = np.nan

        # normalize anomaly roughly 0–1
        if out["anomaly_score"].notna().any():
            amin = out["anomaly_score"].min()
            amax = out["anomaly_score"].max()
            if amax > amin:
                out["anomaly_norm"] = (out["anomaly_score"] - amin) / (amax - amin)
            else:
                out["anomaly_norm"] = 0.5
        else:
            out["anomaly_norm"] = np.nan

        def combined(row):
            vals = []
            if not np.isnan(row["fraud_probability"]):
                vals.append(row["fraud_probability"])
            if not np.isnan(row["anomaly_norm"]):
                vals.append(row["anomaly_norm"])
            return float(np.mean(vals)) if vals else np.nan

        out["combined_risk"] = out.apply(combined, axis=1)
        out["risk_reason"] = feature_engineering(df).apply(self._reason_codes, axis=1)
        out["risk_label"] = out["combined_risk"].apply(
            lambda x: "High" if x >= 0.75 else ("Medium" if x >= 0.4 else "Low")
        )
        # --------- SANITIZE ALL NUMERIC OUTPUTS ----------
        out = out.replace([np.inf, -np.inf], np.nan)
        out = out.fillna(0)

        # Ensure combined_risk is between 0 and 1
        out["combined_risk"] = out["combined_risk"].clip(lower=0, upper=1)

        # Ensure anomaly_norm is valid
        if "anomaly_norm" in out.columns:
            out["anomaly_norm"] = out["anomaly_norm"].clip(lower=0, upper=1)

        # Ensure fraud_probability is valid
        if "fraud_probability" in out.columns:
            out["fraud_probability"] = (
                out["fraud_probability"]
                .clip(lower=0, upper=1)
                .fillna(0)
            )

        return out
