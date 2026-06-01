"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// Dados fictícios — últimos 30 dias
function generateData() {
  const labels = ["1 Mai","","","","","","8 Mai","","","","","","15 Mai","","","","","","22 Mai","","","","","","","","","","","30 Mai"];
  return labels.map((label, i) => ({
    day: label,
    views: Math.floor(30 + Math.sin(i * 0.6) * 20 + Math.random() * 30 + (i > 20 ? 20 : 0)),
  }));
}

const DATA = generateData();

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy text-white text-xs font-sans px-3 py-2 rounded-lg shadow-lg">
      <p className="text-white/60 mb-0.5">{label}</p>
      <p className="font-semibold">{payload[0].value} visualizações</p>
    </div>
  );
}

export function ViewsChart() {
  return (
    <div className="bg-white rounded-xl border border-border/50 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-sans font-semibold text-sm text-ink">Visualizações por dia</h3>
          <p className="text-xs text-faint font-sans">Últimos 30 dias</p>
        </div>
        <select className="text-xs font-sans border border-border rounded-lg px-2 py-1.5 text-muted outline-none">
          <option>Últimos 30 dias</option>
          <option>Últimos 7 dias</option>
          <option>Últimos 90 dias</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={DATA} barSize={8} margin={{ left: -20, right: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E4E0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27,58,92,0.04)" }} />
          <Bar
            dataKey="views"
            fill="#1B3A5C"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
