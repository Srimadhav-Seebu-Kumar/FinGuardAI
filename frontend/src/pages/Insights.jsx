export default function Insights() {
  return (
    <div className="space-y-4">
      <h2 className="stat-value" style={{ fontSize: 22 }}>Model Insights</h2>
      <p className="text-muted">
        Explainability & analytics: feature importance, fraud rate trends,
        high-risk merchants and repeat-offender users.
      </p>

      <div className="card">
        <div className="stat-title">Top Drivers of Fraud</div>
        <ul style={{ marginTop: 10, fontSize: 13 }}>
          <li>1. <b>Transaction amount</b> – 32% contribution</li>
          <li>2. <b>Amount vs user average</b> – 24% contribution</li>
          <li>3. <b>Night-time flag</b> – 14% contribution</li>
          <li>4. <b>Crypto merchant category</b> – 11% contribution</li>
          <li>5. <b>Velocity per user</b> – 9% contribution</li>
        </ul>
      </div>

      <div className="card">
        <div className="stat-title">Narrative Insight</div>
        <p className="text-muted" style={{ marginTop: 8 }}>
          “In the last 7 days, 78% of confirmed fraud originated from new
          devices in high-risk geographies with amounts at least 8× higher
          than the customer’s normal spend. These patterns are now encoded as
          rules and used to boost the AI risk score in real time.”
        </p>
      </div>
    </div>
  );
}
