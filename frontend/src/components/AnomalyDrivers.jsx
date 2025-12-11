import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Geo Mismatch", value: 82 },
  {},
  { name: "Velocity > 10x/min", value: 64 },
  {},
  { name: "New Device Fingerprint", value: 47 },
  {},
  { name: "High Value Round Number", value: 33 },
];

export default function AnomalyDrivers() {
  return (
    <div className="card" style={{ minHeight: 260 }}>
      <div className="stat-title" style={{marginBottom: 12}}>Primary Anomaly Drivers</div>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} layout="vertical" margin={{ left: 20  }}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" fill="#5457eeff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
