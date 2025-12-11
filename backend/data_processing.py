import pandas as pd
import numpy as np
from dateutil.parser import parse
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET_COL = "is_fraud"


def load_csv(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


def _parse_ts(ts):
    """Safely parse timestamps into datetime."""
    try:
        return parse(str(ts))
    except Exception:
        return pd.NaT


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add behavioural + temporal features.
    FULLY SAFE VERSION that never crashes on:
    - bad numeric values
    - missing timestamps
    - corrupted CSV fields
    """
    df = df.copy()

    # -----------------------------
    # 1. TIMESTAMP FEATURES
    # -----------------------------
    if "timestamp" in df.columns:
        df["timestamp"] = df["timestamp"].apply(_parse_ts)
        df["hour"] = df["timestamp"].dt.hour.fillna(0).astype(int)
        df["day_of_week"] = df["timestamp"].dt.dayofweek.fillna(0).astype(int)
        df["is_night"] = df["hour"].apply(lambda h: 1 if h in [0,1,2,3,4] else 0)
        df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    else:
        df["hour"] = 0
        df["day_of_week"] = 0
        df["is_night"] = 0
        df["is_weekend"] = 0

    # -----------------------------
    # 2. SAFE NUMERIC AMOUNT CLEANING
    # -----------------------------
    if "amount" in df.columns:
        df["amount"] = (
            df["amount"]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.replace(" ", "", regex=False)
            .str.extract(r"(\d+\.?\d*)")[0]  # extract numeric part
        )
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)
        df["log_amount"] = np.log1p(df["amount"])
    else:
        df["amount"] = 0.0
        df["log_amount"] = 0.0

    # -----------------------------
    # 3. USER AGGREGATIONS
    # -----------------------------
    if "user_id" in df.columns:
        try:
            df["user_id"] = pd.to_numeric(df["user_id"], errors="coerce").fillna(-1)
        except Exception:
            df["user_id"] = -1

        user_stats = (
            df.groupby("user_id")["amount"]
            .agg(["mean", "max", "count"])
            .rename(columns={
                "mean": "user_avg_amount",
                "max": "user_max_amount",
                "count": "user_tx_count"
            })
        )

        df = df.merge(user_stats, on="user_id", how="left")

        df["amount_vs_user_avg"] = (
            df["amount"] / (df["user_avg_amount"] + 1e-6)
        )
    else:
        df["user_avg_amount"] = 0.0
        df["user_max_amount"] = 0.0
        df["user_tx_count"] = 0
        df["amount_vs_user_avg"] = 0.0

    # -----------------------------
    # 4. CLEAN CATEGORICAL COLUMNS
    # -----------------------------
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].fillna("unknown")

    # -----------------------------
    # 5. CLEAN NUMERIC COLUMNS
    # -----------------------------
    numeric_cols = [
        "amount", "log_amount",
        "user_avg_amount", "user_max_amount", "user_tx_count",
        "amount_vs_user_avg",
        "hour", "day_of_week", "is_night", "is_weekend",
        "user_id"
    ]

    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    return df


def build_feature_target(df: pd.DataFrame):
    """
    Split X/y, drop unwanted ID columns,
    and separate numeric vs categorical properly.
    """
    df = df.copy()

    # Target column
    y = None
    if TARGET_COL in df.columns:
        y = pd.to_numeric(df[TARGET_COL], errors="coerce").fillna(0).astype(int)
        df = df.drop(columns=[TARGET_COL])

    # Drop identifiers that shouldn't be features
    drop_cols = ["transaction_id", "timestamp"]
    for col in drop_cols:
        if col in df.columns:
            df = df.drop(columns=[col])

    # Feature types
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=["object"]).columns.tolist()

    return df, y, numeric_cols, categorical_cols


def create_preprocessor(num_cols, cat_cols):
    """
    Create full sklearn preprocessing pipeline.
    """
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown="ignore")

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, num_cols),
            ("cat", categorical_transformer, cat_cols),
        ]
    )

    return preprocessor


def split_xy(X, y, test_size=0.2, random_state=42):
    """
    Train-test split only if labels exist.
    """
    if y is None:
        return X, None, None, None

    return train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )
