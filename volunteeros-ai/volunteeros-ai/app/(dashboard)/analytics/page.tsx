import { TrendingUp, Users, Clock, Building2, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { VolunteerGrowthChart, AttendanceChart, EventCategoryChart } from "@/components/dashboard/charts";

const insights = [
  { title: "Weekend events fill 34% faster", detail: "Consider scheduling more Saturday events to capture peak volunteer availability." },
  { title: "Kochi cluster is nearing capacity", detail: "Volunteer supply in Kochi has outpaced open event slots for 3 consecutive weeks." },
  { title: "Health-category retention is highest", detail: "Volunteers who complete a Health event are 2.1x more likely to return within 30 days." },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Analytics</h1>
        <p className="text-sm text-muted-foreground">Program performance across volunteers, events, and organizations.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Active Volunteers" value="8,214" delta="+3.4%" />
        <StatCard icon={Clock} label="Total Hours Logged" value="48,210" delta="+6.1%" />
        <StatCard icon={Building2} label="Organizations" value="134" delta="+4" />
        <StatCard icon={TrendingUp} label="Retention Rate" value="76%" delta="+2.3%" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Volunteer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <VolunteerGrowthChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <EventCategoryChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Sparkles size={16} className="text-espresso-500" />
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((ins, i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{ins.title}</span>
                  <Badge variant="secondary" className="shrink-0">Prediction</Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{ins.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
