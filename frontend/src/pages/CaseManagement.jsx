export default function CaseManagement() {
  return (
    <div className="space-y-4">
      <h2 className="stat-value" style={{ fontSize: 22 }}>Case Management</h2>
      <p className="text-muted">
        Workflow for analysts to review, comment, assign and close suspicious
        cases. Here you describe that each row comes from the AI model and is
        backed by evidence & reasoning.
      </p>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Transaction</th>
              <th>Risk</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>C-1042</td>
              <td>TX-8821</td>
              <td>High</td>
              <td>Alex Analyst</td>
              <td>Open</td>
              <td>12m remaining</td>
            </tr>
            <tr>
              <td>C-1043</td>
              <td>TX-8822</td>
              <td>High</td>
              <td>Chris Chen</td>
              <td>Escalated</td>
              <td>Breached</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
