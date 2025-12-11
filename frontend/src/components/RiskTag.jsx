export default function RiskTag({ level }) {
  let bg = "#e5e7eb";
  let dot = "#9ca3af";
  let label = level || "Low";

  if (level === "High") {
    bg = "#fee2e2";
    dot = "#b91c1c";
  } else if (level === "Medium") {
    bg = "#fef9c3";
    dot = "#b45309";
  } else if (level === "Low") {
    bg = "#dcfce7";
    dot = "#15803d";
  }

  return (
    <span className="risk-pill" style={{ backgroundColor: bg }}>
      <span className="risk-dot" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}
