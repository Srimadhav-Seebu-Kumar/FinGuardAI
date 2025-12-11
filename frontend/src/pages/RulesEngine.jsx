export default function RulesEngine() {
  return (
    <div className="space-y-4">
      <h2 className="stat-value" style={{ fontSize: 22 }}>Rules Engine</h2>
      <p className="text-muted">
        Hybrid AI + rules approach. Analysts can create human-readable rules that
        add or subtract risk points on top of the machine-learning model.
      </p>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Condition</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>High ticket at night</td>
              <td>amount &gt; 5000 AND is_night == 1</td>
              <td>+30 risk points</td>
              <td>Enabled</td>
            </tr>
            <tr>
              <td>Velocity burst</td>
              <td>user_tx_count &gt; 10 in 10 minutes</td>
              <td>Auto escalate</td>
              <td>Enabled</td>
            </tr>
            <tr>
              <td>Trusted salary merchant</td>
              <td>merchant_category == payroll</td>
              <td>-25 risk points</td>
              <td>Enabled</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
