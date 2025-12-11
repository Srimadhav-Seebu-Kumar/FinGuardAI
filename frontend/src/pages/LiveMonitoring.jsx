export default function LiveMonitoring() {
  return (
    <div className="space-y-4">
      <h2 className="stat-value" style={{ fontSize: 22 }}>Live Monitoring</h2>
      <p className="text-muted">
        Streaming anomaly feed from the last 15 minutes. In a production
        deployment this page would auto-refresh and show heatmaps, geo view and
        high-risk bursts.
      </p>

      <div className="card">
        <div className="stat-title">Recent Alerts</div>
        <ul style={{ marginTop: 10, fontSize: 13 }}>
          <li>10:42:05 – <b>TX-8821</b> · High risk · IP mismatch + high ticket amount</li>
          <li>10:41:55 – <b>TX-8822</b> · High risk · structuring pattern across 3 merchants</li>
          <li>10:38:12 – <b>TX-8819</b> · Medium risk · velocity spike on POS terminal</li>
          <li>10:35:00 – <b>TX-8815</b> · Medium risk · VPN + anonymous device</li>
        </ul>
      </div>
    </div>
  );
}
