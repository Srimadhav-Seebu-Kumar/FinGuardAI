export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="nav-title">Dashboard / Real-time Overview</div>
        <div className="nav-search">
          <span role="img" aria-label="search">🔍</span>
          <input
            placeholder="Search transaction ID, user, or IP…"
          />
        </div>
      </div>

      <div className="nav-right">
        <span className="badge-online">● Model v1.0 · Online</span>
        <span className="text-muted">Today: {today}</span>
      </div>
    </header>
  );
}
