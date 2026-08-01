import { Building2, Users, CalendarDays, Radio, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrganizationTable } from "@/components/organizations/organization-table";
import { Button } from "@/components/ui/button";

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
            Organizations
          </h1>
          <p className="text-sm text-muted-foreground">
            134 organizations run their programs on VolunteerOS AI.
          </p>
        </div>
        <Button>
          <Plus size={15} /> Add Organization
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Building2} label="Organizations" value="134" delta="+4" />
        <StatCard icon={Users} label="Total Volunteers" value="10,482" />
        <StatCard icon={CalendarDays} label="Events Run" value="512" />
        <StatCard icon={Radio} label="Active Broadcasts" value="2" />
      </div>

      <OrganizationTable />
    </div>
  );
}
