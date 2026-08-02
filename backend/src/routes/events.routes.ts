import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";

export const eventsRouter = Router();
eventsRouter.use(requireAuth);

eventsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === "string" && req.query.status !== "All" ? req.query.status.toLowerCase() : null;
    const params: unknown[] = [];
    let where = "";
    if (status) {
      params.push(status);
      where = `where e.status = $1`;
    }
    const result = await pool.query(
      `select e.*, o.name as organization,
              count(distinct r.id) as registered_count,
              count(distinct a.id) as attended_count
       from events e
       left join organizations o on o.id = e.organization_id
       left join event_registrations r on r.event_id = e.id
       left join attendance a on a.event_id = e.id
       ${where}
       group by e.id, o.name
       order by e.start_time asc`,
      params
    );
    res.json(result.rows);
  })
);

const createSchema = z.object({
  organizationId: z.string().uuid().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
});

eventsRouter.post(
  "/",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const result = await pool.query(
      `insert into events (organization_id, title, description, location, start_time, end_time, capacity)
       values ($1, $2, $3, $4, $5, $6, $7) returning *`,
      [body.organizationId ?? null, body.title, body.description ?? null, body.location ?? null, body.startTime, body.endTime ?? null, body.capacity ?? null]
    );
    res.status(201).json(result.rows[0]);
  })
);

eventsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      `select e.*, o.name as organization from events e left join organizations o on o.id = e.organization_id where e.id = $1`,
      [req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Event not found" });
    res.json(result.rows[0]);
  })
);

eventsRouter.patch(
  "/:id",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    const body = createSchema.partial().extend({ status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional() }).parse(req.body);
    const result = await pool.query(
      `update events set
         title = coalesce($2, title),
         description = coalesce($3, description),
         location = coalesce($4, location),
         start_time = coalesce($5, start_time),
         end_time = coalesce($6, end_time),
         capacity = coalesce($7, capacity),
         status = coalesce($8, status)
       where id = $1 returning *`,
      [req.params.id, body.title ?? null, body.description ?? null, body.location ?? null, body.startTime ?? null, body.endTime ?? null, body.capacity ?? null, body.status ?? null]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Event not found" });
    res.json(result.rows[0]);
  })
);

eventsRouter.delete(
  "/:id",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    await pool.query("delete from events where id = $1", [req.params.id]);
    res.status(204).send();
  })
);

// A volunteer signing up for an event
eventsRouter.post(
  "/:id/register",
  asyncHandler(async (req: AuthedRequest, res) => {
    const volunteerId = req.body.volunteerId || req.user!.id;
    const result = await pool.query(
      `insert into event_registrations (event_id, volunteer_id) values ($1, $2)
       on conflict (event_id, volunteer_id) do nothing returning *`,
      [req.params.id, volunteerId]
    );
    if (!result.rowCount) return res.status(409).json({ error: "Already registered for this event" });
    res.status(201).json(result.rows[0]);
  })
);
