"use client";

import Link from "next/link";
import { Users, UserCheck, UserPlus, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { VolunteerTable } from "@/components/volunteers/volunteer-table";
import { volunteerStats } from "@/data/volunteers";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function VolunteersPage() {
  const { registeredVolunteers } = useStore();

  const total = volunteerStats.total + registeredVolunteers.length;
  const active =
    volunteerStats.active + registeredVolunteers.filter((v) => v.status === "active").length;
  const newThisMonth = volunteerStats.newThisMonth + registeredVolunteers.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
            Volunteers
          </h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString("en-IN")} volunteers across your network.
            {registeredVolunteers.length > 0 && (
              <>
                {" "}
                <span className="font-medium text-foreground">
                  {registeredVolunteers.length} new
                </span>{" "}
                from registration, awaiting approval.
              </>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/volunteer-register">
            <UserPlus size={15} /> Add Volunteer
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Volunteers" value={total.toLocaleString("en-IN")} />
        <StatCard icon={UserCheck} label="Active" value={active.toLocaleString("en-IN")} />
        <StatCard
          icon={UserPlus}
          label="New This Month"
          value={newThisMonth.toString()}
          delta="+18%"
        />
        <StatCard
          icon={Clock}
          label="Avg Hours / Volunteer"
          value={`${volunteerStats.avgHoursPerVolunteer}h`}
        />
      </div>

      <VolunteerTable />
    </div>
  );
}
