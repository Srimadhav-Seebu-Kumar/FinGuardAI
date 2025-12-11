import { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import AnomalyDrivers from "../components/AnomalyDrivers";
import FraudTable from "../components/FraudTable";

export default function Dashboard() {
  const [uploadedResults, setUploadedResults] = useState([]);

  return (
    <div className="space-y-6">

      {/* CSV Upload */}
      <div className="card">
        <div className="stat-title">Upload Your Own Data</div>
        <p className="text-muted">
          Upload a CSV file containing your transactions. The AI model will analyze
          them and display risk scores and anomaly explanations.
        </p>

        <div style={{ marginTop: 12 }}>
          <CSVUploader onResults={(data) => setUploadedResults(data)} />
        </div>
      </div>

      {/* If data uploaded -> show ONLY the uploaded FraudTable */}
      {uploadedResults.length > 0 && (
        <FraudTable overrideRows={uploadedResults} />
      )}

      {/* Only show the built-in dashboard if no uploaded file */}
      {uploadedResults.length === 0 && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-4">
            <StatCard
              title="Total Value at Risk"
              value="$142,390"
              sub="+12% vs last hour"
              subColor="#b91c1c"
            />
            <StatCard
              title="Global Anomaly Rate"
              value="1.4%"
              sub="-0.2% stable"
              subColor="#16a34a"
            />
            <StatCard
              title="Pending Review"
              value="42 Cases"
              sub="Analyst queue"
            />
            <StatCard
              title="Model Precision"
              value="98.2%"
              sub="Excellent · v1.0"
              subColor="#16a34a"
            />
          </div>

          <div className="grid grid-cols-3">
            <ChartCard />
            <AnomalyDrivers />
          </div>

          <FraudTable />
        </>
      )}
    </div>
  );
}
