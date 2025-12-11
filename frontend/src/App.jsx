import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LiveMonitoring from "./pages/LiveMonitoring";
import CaseManagement from "./pages/CaseManagement";
import Insights from "./pages/Insights";
import RulesEngine from "./pages/RulesEngine";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="content-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live" element={<LiveMonitoring />} />
            <Route path="/cases" element={<CaseManagement />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/rules" element={<RulesEngine />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
