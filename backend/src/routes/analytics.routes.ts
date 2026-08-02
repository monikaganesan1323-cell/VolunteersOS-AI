import { Router } from "express";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

export const analyticsRouter = Router();
analyticsRouter.use(requireAuth);

// Volunteer growth per month (last 12 months)
analyticsRouter.get(
  "/volunteer-growth",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      select date_trunc('month', joined_at) as month, count(*) as new_volunteers
      from volunteers
      where joined_at >= now() - interval '12 months'
      group by 1 order by 1
    `);
    res.json(result.rows);
  })
);

// Hours logged per month (last 12 months)
analyticsRouter.get(
  "/hours-over-time",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      select date_trunc('month', check_in_time) as month, coalesce(sum(hours_logged), 0) as hours
      from attendance
      where check_in_time >= now() - interval '12 months'
      group by 1 order by 1
    `);
    res.json(result.rows);
  })
);

// Volunteer count + hours per organization
analyticsRouter.get(
  "/by-organization",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      select o.name as organization,
             count(distinct v.id) as volunteers,
             coalesce(sum(v.total_hours), 0) as total_hours
      from organizations o
      left join volunteers v on v.organization_id = o.id
      group by o.name
      order by total_hours desc
    `);
    res.json(result.rows);
  })
);

// Event status breakdown, for a pie/donut chart
analyticsRouter.get(
  "/event-status-breakdown",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      select status, count(*) as count from events group by status
    `);
    res.json(result.rows);
  })
);
