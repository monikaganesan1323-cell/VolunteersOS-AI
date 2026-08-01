import { Users, UserCheck, UserPlus, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { VolunteerTable } from "@/components/volunteers/volunteer-table";
import { volunteerStats } from "@/data/volunteers";
import { Button } from "@/components/ui/button";

export default function VolunteersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
            Volunteers
          </h1>
          <p className="text-sm text-muted-foreground">
            {volunteerStats.total.toLocaleString("en-IN")} volunteers across your network.
          </p>
        </div>
        <Button>
          <UserPlus size={15} /> Add Volunteer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Volunteers" value={volunteerStats.total.toLocaleString("en-IN")} />
        <StatCard icon={UserCheck} label="Active" value={volunteerStats.active.toLocaleString("en-IN")} />
        <StatCard icon={UserPlus} label="New This Month" value={volunteerStats.newThisMonth.toString()} delta="+18%" />
        <StatCard icon={Clock} label="Avg Hours / Volunteer" value={`${volunteerStats.avgHoursPerVolunteer}h`} />
      </div>

      <VolunteerTable />
    </div>
  );
}
