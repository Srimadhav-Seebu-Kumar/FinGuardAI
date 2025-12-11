export default function Settings() {
  return (
    <div className="space-y-4">
      <h2 className="stat-value" style={{ fontSize: 22 }}>Settings</h2>
      <p className="text-muted">
        Configure model versions, API keys and organisation-wide thresholds.
      </p>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="stat-title">Risk Thresholds</div>
        <div className="text-muted" style={{ marginTop: 8, marginBottom: 8 }}>
          Current policy:
        </div>
        <ul className="text-muted">
          <li>High risk ≥ 0.75 – auto block & manual review</li>
          <li>Medium risk ≥ 0.40 – allow + queue for review</li>
          <li>Low risk &lt; 0.40 – allow with logging only</li>
        </ul>
      </div>
    </div>
  );
}
