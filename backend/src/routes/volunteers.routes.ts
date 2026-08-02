import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

export const volunteersRouter = Router();
volunteersRouter.use(requireAuth);

// GET /api/volunteers?status=active&search=ananya&page=1&pageSize=20
volunteersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === "string" && req.query.status !== "All" ? req.query.status.toLowerCase() : null;
    const search = typeof req.query.search === "string" ? `%${req.query.search}%` : null;
    const page = Number(req.query.page) || 1;
    const pageSize = Math.min(Number(req.query.pageSize) || 20, 100);
    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const params: unknown[] = [];
    if (status) {
      params.push(status);
      where.push(`v.status = $${params.length}`);
    }
    if (search) {
      params.push(search);
      where.push(`(u.name ilike $${params.length} or o.name ilike $${params.length})`);
    }
    const whereClause = where.length ? `where ${where.join(" and ")}` : "";

    params.push(pageSize, offset);
    const rows = await pool.query(
      `select u.id, u.name, u.avatar_url, o.name as organization, o.location,
              v.status, v.total_hours, v.total_events, v.joined_at
       from volunteers v
       join users u on u.id = v.id
       left join organizations o on o.id = v.organization_id
       ${whereClause}
       order by u.name asc
       limit $${params.length - 1} offset $${params.length}`,
      params
    );

    const countResult = await pool.query(
      `select count(*) from volunteers v join users u on u.id = v.id left join organizations o on o.id = v.organization_id ${whereClause}`,
      params.slice(0, params.length - 2)
    );

    res.json({
      data: rows.rows,
      page,
      pageSize,
      total: Number(countResult.rows[0].count),
    });
  })
);

// GET /api/volunteers/summary -> the 4 stat cards at the top of the Volunteers page
volunteersRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      select
        count(*) as total,
        count(*) filter (where status = 'active') as active,
        count(*) filter (where joined_at >= date_trunc('month', now())) as new_this_month,
        coalesce(avg(total_hours), 0) as avg_hours
      from volunteers
    `);
    res.json(result.rows[0]);
  })
);

volunteersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      `select u.id, u.name, u.email, u.avatar_url, o.name as organization,
              v.status, v.total_hours, v.total_events, v.joined_at
       from volunteers v
       join users u on u.id = v.id
       left join organizations o on o.id = v.organization_id
       where v.id = $1`,
      [req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Volunteer not found" });
    res.json(result.rows[0]);
  })
);

const updateSchema = z.object({
  status: z.enum(["active", "pending", "inactive"]).optional(),
  organizationId: z.string().uuid().nullable().optional(),
});

volunteersRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const result = await pool.query(
      `update volunteers set
         status = coalesce($2, status),
         organization_id = coalesce($3, organization_id)
       where id = $1
       returning *`,
      [req.params.id, body.status ?? null, body.organizationId ?? null]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Volunteer not found" });
    res.json(result.rows[0]);
  })
);
