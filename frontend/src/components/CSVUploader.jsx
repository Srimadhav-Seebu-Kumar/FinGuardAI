import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const API_BASE = "surprising-essence-production.up.railway.app";

export default function CSVUploader({ onResults }) {
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const jsonData = results.data;

          // Send to backend
          const res = await axios.post(`${API_BASE}/score`, jsonData);

          // Send data back to Dashboard.jsx
          onResults(res.data);
        } catch (err) {
          console.error(err);
          alert("Error scoring uploaded CSV.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      <label className="btn btn-primary" style={{ cursor: "pointer" }}>
        Upload CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </label>

      {loading && (
        <span className="text-muted" style={{ marginLeft: 10 }}>
          Scoring...
        </span>
      )}
    </div>
  );
}
