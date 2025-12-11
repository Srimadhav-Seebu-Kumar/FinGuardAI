import { useEffect, useState } from "react";
import axios from "axios";
import RiskTag from "./RiskTag";

const API_BASE = "http://127.0.0.1:8000";

export default function FraudTable({ overrideRows }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If CSV uploaded → use uploaded rows
    if (overrideRows && overrideRows.length > 0) {
      const sorted = [...overrideRows].sort(
        (a, b) => b.combined_risk - a.combined_risk
      );
      setRows(sorted);
      return;
    }

    // Else → load demo sample data
    async function loadDemo() {
      try {
        setLoading(true);
        const sample = [
          {
            transaction_id: "TX-8821",
            user_id: 101,
            amount: 4500,
            currency: "USD",
            timestamp: "2025-10-01 10:42:05",
            merchant_category: "online_shopping",
            channel: "web",
            location: "Nigeria/US",
            device_type: "new_device",
          },
          {
            transaction_id: "TX-8822",
            user_id: 170,
            amount: 9999,
            currency: "USD",
            timestamp: "2025-10-01 10:41:55",
            merchant_category: "luxury_goods",
            channel: "web",
            location: "London",
            device_type: "desktop",
          }
        ];

        const res = await axios.post(`${API_BASE}/score`, sample);

        setRows(
          res.data.sort((a, b) => b.combined_risk - a.combined_risk)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDemo();
  }, [overrideRows]);

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div>
          <div className="stat-title">Suspicious Transactions</div>
          <div className="text-muted">
            Showing {rows.length} result(s)
          </div>
        </div>
      </div>

      {loading && <div className="text-muted">Loading from AI model…</div>}

      {!loading && (
        <table className="table">
          <thead>
            <tr>
              <th>Risk</th>
              <th>ID</th>
              <th>Amount</th>
              <th>User</th>
              <th>Reason</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <RiskTag level={row.risk_label} />
                </td>
                <td>{row.transaction_id || "-"}</td>
                <td>
                  {row.currency || "USD"} {Number(row.amount).toFixed(2)}
                </td>
                <td>{row.user_id || "N/A"}</td>
                <td>{row.risk_reason}</td>
                <td
                  style={{
                    fontWeight: 700,
                    color: "#b91c1c",
                  }}
                >
                  {(row.combined_risk * 100).toFixed(1)}%
                </td>
                <td>
                  <button className="btn btn-danger" style={{ marginRight: 6 }}>
                    Block
                  </button>
                  <button className="btn btn-outline">Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rows.length === 0 && (
        <div className="text-muted" style={{ marginTop: 8 }}>
          No transactions found.
        </div>
      )}
    </div>
  );
}
