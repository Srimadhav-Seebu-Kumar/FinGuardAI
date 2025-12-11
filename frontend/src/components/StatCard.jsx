export default function StatCard({ title, value, sub, subColor }) {
  return (
    <div className="card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {sub && (
        <div className="stat-sub" style={{ color: subColor || "#6b7280" }}>
          {sub}
        </div>
      )}
    </div>
  );
}
