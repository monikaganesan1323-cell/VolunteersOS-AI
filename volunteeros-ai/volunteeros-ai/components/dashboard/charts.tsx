"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { volunteerGrowth, attendanceTrend, eventCategoryBreakdown } from "@/data/misc";

const PIE_COLORS = ["#6F4E37", "#B98A5E", "#D68C45", "#EFCB98", "#8CA372", "#C25A32"];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-warm">
      <div className="font-medium text-foreground">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-muted-foreground">
          {p.name}: <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function VolunteerGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={volunteerGrowth}>
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C5E3C" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8C5E3C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(140,94,60,0.12)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#8C6F5A" />
        <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#8C6F5A" />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="volunteers" stroke="#6F4E37" strokeWidth={2.5} fill="url(#growthFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={attendanceTrend}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(140,94,60,0.12)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#8C6F5A" />
        <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#8C6F5A" />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(140,94,60,0.06)" }} />
        <Bar dataKey="attendance" fill="#B98A5E" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EventCategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={eventCategoryBreakdown}
          dataKey="value"
          nameKey="category"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        >
          {eventCategoryBreakdown.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
