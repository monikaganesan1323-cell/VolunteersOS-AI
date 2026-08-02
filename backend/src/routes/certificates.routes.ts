import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";

export const certificatesRouter = Router();
certificatesRouter.use(requireAuth);

certificatesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const volunteerId = typeof req.query.volunteerId === "string" ? req.query.volunteerId : null;
    const params: unknown[] = [];
    let where = "";
    if (volunteerId) {
      params.push(volunteerId);
      where = `where c.volunteer_id = $1`;
    }
    const result = await pool.query(
      `select c.*, u.name as volunteer_name, e.title as event_title
       from certificates c
       join volunteers v on v.id = c.volunteer_id
       join users u on u.id = v.id
       left join events e on e.id = c.event_id
       ${where}
       order by c.issued_at desc`,
      params
    );
    res.json(result.rows);
  })
);

const issueSchema = z.object({
  volunteerId: z.string().uuid(),
  eventId: z.string().uuid().optional(),
  title: z.string().min(2),
  certificateUrl: z.string().url().optional(),
});

certificatesRouter.post(
  "/",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    const body = issueSchema.parse(req.body);
    const result = await pool.query(
      `insert into certificates (volunteer_id, event_id, title, certificate_url)
       values ($1, $2, $3, $4) returning *`,
      [body.volunteerId, body.eventId ?? null, body.title, body.certificateUrl ?? null]
    );
    res.status(201).json(result.rows[0]);
  })
);

certificatesRouter.delete(
  "/:id",
  requireRole("admin", "program_admin"),
  asyncHandler(async (req, res) => {
    await pool.query("delete from certificates where id = $1", [req.params.id]);
    res.status(204).send();
  })
);
