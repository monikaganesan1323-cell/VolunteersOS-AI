import { Router } from "express";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

export const leaderboardRouter = Router();
leaderboardRouter.use(requireAuth);

// GET /api/leaderboard?period=month|week|all&limit=20
leaderboardRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const period = typeof req.query.period === "string" ? req.query.period : "all";
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    let sinceClause = "";
    if (period === "month") sinceClause = "and a.check_in_time >= date_trunc('month', now())";
    if (period === "week") sinceClause = "and a.check_in_time >= date_trunc('week', now())";

    const result = await pool.query(
      `select u.id, u.name, u.avatar_url, o.name as organization,
              coalesce(sum(a.hours_logged), 0) as hours,
              count(distinct a.event_id) as events,
              rank() over (order by coalesce(sum(a.hours_logged), 0) desc) as rank
       from volunteers v
       join users u on u.id = v.id
       left join organizations o on o.id = v.organization_id
       left join attendance a on a.volunteer_id = v.id ${sinceClause}
       group by u.id, u.name, u.avatar_url, o.name
       order by hours desc
       limit $1`,
      [limit]
    );
    res.json(result.rows);
  })
);
