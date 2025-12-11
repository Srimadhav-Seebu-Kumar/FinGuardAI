import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { label: "Dashboard", path: "/" },
  { label: "Live Monitoring", path: "/live" },
  { label: "Case Management", path: "/cases" },
  { label: "Insights", path: "/insights" },
  { label: "Rules Engine", path: "/rules" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo" />
        <div>
          <div className="sidebar-title">FinGuard AI</div>
          <div className="text-muted">Fraud Intelligence Platform</div>
        </div>
      </div>

      <nav className="sidebar-menu">
        {items.map((item) => (
          <div
            key={item.path}
            className={
              "sidebar-item" +
              (location.pathname === item.path ? " active" : "")
            }
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="text-muted">Alex Analyst</div>
        <div className="text-muted">Senior Risk Officer</div>
      </div>
    </aside>
  );
}
