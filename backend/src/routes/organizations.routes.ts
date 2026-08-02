import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const organizationsRouter = Router();
organizationsRouter.use(requireAuth);

organizationsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const result = await pool.query(`
      select o.id, o.name, o.location, o.description,
             count(distinct v.id) as volunteer_count,
             count(distinct e.id) as event_count
      from organizations o
      left join volunteers v on v.organization_id = o.id
      left join events e on e.organization_id = o.id
      group by o.id
      order by o.name asc
    `);
    res.json(result.rows);
  })
);

const createSchema = z.object({
  name: z.string().min(2),
  location: z.string().optional(),
  description: z.string().optional(),
});

organizationsRouter.post(
  "/",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const result = await pool.query(
      `insert into organizations (name, location, description) values ($1, $2, $3) returning *`,
      [body.name, body.location ?? null, body.description ?? null]
    );
    res.status(201).json(result.rows[0]);
  })
);

organizationsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await pool.query("select * from organizations where id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Organization not found" });
    res.json(result.rows[0]);
  })
);

organizationsRouter.patch(
  "/:id",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.partial().parse(req.body);
    const result = await pool.query(
      `update organizations set
         name = coalesce($2, name),
         location = coalesce($3, location),
         description = coalesce($4, description)
       where id = $1 returning *`,
      [req.params.id, body.name ?? null, body.location ?? null, body.description ?? null]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Organization not found" });
    res.json(result.rows[0]);
  })
);

organizationsRouter.delete(
  "/:id",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    await pool.query("delete from organizations where id = $1", [req.params.id]);
    res.status(204).send();
  })
);
