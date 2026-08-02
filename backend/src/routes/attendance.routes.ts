import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const attendanceRouter = Router();
attendanceRouter.use(requireAuth);

attendanceRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const eventId = typeof req.query.eventId === "string" ? req.query.eventId : null;
    const volunteerId = typeof req.query.volunteerId === "string" ? req.query.volunteerId : null;
    const where: string[] = [];
    const params: unknown[] = [];
    if (eventId) {
      params.push(eventId);
      where.push(`a.event_id = $${params.length}`);
    }
    if (volunteerId) {
      params.push(volunteerId);
      where.push(`a.volunteer_id = $${params.length}`);
    }
    const whereClause = where.length ? `where ${where.join(" and ")}` : "";
    const result = await pool.query(
      `select a.*, u.name as volunteer_name, e.title as event_title
       from attendance a
       join volunteers v on v.id = a.volunteer_id
       join users u on u.id = v.id
       join events e on e.id = a.event_id
       ${whereClause}
       order by a.check_in_time desc`,
      params
    );
    res.json(result.rows);
  })
);

// Check in via QR scan (or manual entry by an admin)
const checkInSchema = z.object({
  eventId: z.string().uuid(),
  volunteerId: z.string().uuid().optional(),
  method: z.enum(["qr", "manual"]).default("qr"),
});

attendanceRouter.post(
  "/check-in",
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = checkInSchema.parse(req.body);
    const volunteerId = body.volunteerId || req.user!.id;

    const result = await pool.query(
      `insert into attendance (event_id, volunteer_id, method, verified_by)
       values ($1, $2, $3, $4) returning *`,
      [body.eventId, volunteerId, body.method, req.user!.id]
    );

    await pool.query(
      `update event_registrations set status = 'attended'
       where event_id = $1 and volunteer_id = $2`,
      [body.eventId, volunteerId]
    );

    res.status(201).json(result.rows[0]);
  })
);

// Check out: closes the attendance record and logs hours + rolls them up onto the volunteer
const checkOutSchema = z.object({ attendanceId: z.string().uuid() });

attendanceRouter.post(
  "/check-out",
  asyncHandler(async (req, res) => {
    const body = checkOutSchema.parse(req.body);
    const client = await pool.connect();
    try {
      await client.query("begin");
      const attendanceResult = await client.query(
        `update attendance set
           check_out_time = now(),
           hours_logged = round(extract(epoch from (now() - check_in_time)) / 3600.0, 2)
         where id = $1 returning *`,
        [body.attendanceId]
      );
      if (!attendanceResult.rowCount) {
        await client.query("rollback");
        return res.status(404).json({ error: "Attendance record not found" });
      }
      const attendance = attendanceResult.rows[0];

      await client.query(
        `update volunteers set
           total_hours = total_hours + $2,
           total_events = total_events + 1
         where id = $1`,
        [attendance.volunteer_id, attendance.hours_logged]
      );

      await client.query("commit");
      res.json(attendance);
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  })
);
