from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, RootModel
from typing import List, Dict, Any

import pandas as pd

from fraud_model import FraudDetector
from data_processing import load_csv

app = FastAPI(title="FinGuard AI Backend")

# CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = FraudDetector()
detector.load()


class Transaction(RootModel):
    root: Dict[str, Any]


class TrainRequest(BaseModel):
    csv_path: str = "sample_data.csv"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/train")
def train(req: TrainRequest):
    df = load_csv(req.csv_path)
    metrics = detector.train(df)
    return {"message": "model trained", "metrics": metrics}


@app.post("/score")
def score(transactions: List[Transaction]):
    """
    transactions: List[Transaction], where each Transaction.root is the dict body
    """
    rows = [t.root for t in transactions]
    df = pd.DataFrame(rows)
    scored = detector.score(df)
    return scored.to_dict(orient="records")
