import { Users, MapPin, Clock, Award } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DirectoryTable } from "@/components/portal/directory-table";
import { volunteers, volunteerStats } from "@/data/volunteers";

export default function VolunteerDirectoryPage() {
  const cities = new Set(volunteers.map((v) => v.city)).size;
  const totalBadges = volunteers.reduce((sum, v) => sum + v.badges.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
          Volunteer Directory
        </h1>
        <p className="text-sm text-muted-foreground">
          Public profiles only — contact details and prior-organization history stay with admins.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Volunteers" value={volunteerStats.total.toLocaleString("en-IN")} />
        <StatCard icon={MapPin} label="Cities Represented" value={cities.toString()} />
        <StatCard icon={Clock} label="Avg Hours / Volunteer" value={`${volunteerStats.avgHoursPerVolunteer}h`} />
        <StatCard icon={Award} label="Badges Earned" value={totalBadges.toString()} />
      </div>

      <DirectoryTable />
    </div>
  );
}
