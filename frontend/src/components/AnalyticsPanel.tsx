import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#388e3c', '#bfa046', '#fbc02d', '#1976d2'];

// @ts-ignore
export const AnalyticsPanel = ({ stats }) => (
  <div className="flex flex-col md:flex-row gap-8">
    {/* Круговая диаграмма по типам */}
    <div className="w-full md:w-1/2 bg-white rounded-xl shadow p-4">
      <h3 className="font-bold mb-2">Распределение по типам</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={stats.byType} dataKey="value" nameKey="type" outerRadius={80} label>
            {stats.byType.map((entry: { type: string | number | bigint | null | undefined; }, idx: number) => (
              <Cell key={entry.type} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    {/* Линейный график по месяцам */}
    <div className="w-full md:w-1/2 bg-white rounded-xl shadow p-4">
      <h3 className="font-bold mb-2">Динамика инвестиций</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={stats.byMonth}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sum" stroke="#388e3c" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);