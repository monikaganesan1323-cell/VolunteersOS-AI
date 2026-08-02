import { Router } from "express";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

// Matches the 4 stat cards on the Volunteers/Dashboard screen:
// Total Volunteers, Active, New This Month (+ growth %), Avg Hours / Volunteer
dashboardRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [volunteerStats, eventStats] = await Promise.all([
      pool.query(`
        select
          count(*) as total_volunteers,
          count(*) filter (where status = 'active') as active,
          count(*) filter (where joined_at >= date_trunc('month', now())) as new_this_month,
          count(*) filter (where joined_at >= date_trunc('month', now()) - interval '1 month'
                              and joined_at < date_trunc('month', now())) as new_last_month,
          coalesce(avg(total_hours), 0) as avg_hours
        from volunteers
      `),
      pool.query(`
        select
          count(*) filter (where status = 'upcoming') as upcoming_events,
          count(*) filter (where status = 'completed') as completed_events
        from events
      `),
    ]);

    const v = volunteerStats.rows[0];
    const e = eventStats.rows[0];
    const lastMonth = Number(v.new_last_month);
    const growthPct = lastMonth > 0 ? Math.round(((Number(v.new_this_month) - lastMonth) / lastMonth) * 100) : null;

    res.json({
      totalVolunteers: Number(v.total_volunteers),
      active: Number(v.active),
      newThisMonth: Number(v.new_this_month),
      newThisMonthGrowthPct: growthPct,
      avgHoursPerVolunteer: Number(v.avg_hours).toFixed(1),
      upcomingEvents: Number(e.upcoming_events),
      completedEvents: Number(e.completed_events),
    });
  })
);

// Recent activity feed for the dashboard
dashboardRouter.get(
  "/recent-activity",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      (select 'check_in' as type, a.check_in_time as at, u.name as volunteer, e.title as event
       from attendance a
       join volunteers v on v.id = a.volunteer_id
       join users u on u.id = v.id
       join events e on e.id = a.event_id
       order by a.check_in_time desc limit 10)
      union all
      (select 'signup' as type, v.joined_at as at, u.name as volunteer, null as event
       from volunteers v join users u on u.id = v.id
       order by v.joined_at desc limit 10)
      order by at desc
      limit 15
    `);
    res.json(result.rows);
  })
);
