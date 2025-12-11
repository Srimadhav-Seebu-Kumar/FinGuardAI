import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "10:10", volume: 120, risk: 0.1 },
  { time: "10:20", volume: 280, risk: 0.3 },
  { time: "10:30", volume: 520, risk: 0.7 },
  { time: "10:40", volume: 700, risk: 0.9 },
];

export default function ChartCard() {
  return (
    <div className="card" style={{ minHeight: 260 }}>
      <div className="stat-title">Real-time Transaction Volume vs Risk Score</div>
      <div className="text-muted" style={{ marginTop: 4, marginBottom: 12 }}>
        Live monitoring stream 10:00 AM – 11:00 AM
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="volume" stroke="#0ea5e9" strokeWidth={2} />
          <Line type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
