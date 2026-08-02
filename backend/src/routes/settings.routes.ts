import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

settingsRouter.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const result = await pool.query(
      `select u.id, u.name, u.email, u.avatar_url, u.role,
              s.theme, s.notifications_enabled, s.timezone
       from users u
       left join user_settings s on s.user_id = u.id
       where u.id = $1`,
      [req.user!.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  })
);

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
  theme: z.enum(["light", "dark"]).optional(),
  notificationsEnabled: z.boolean().optional(),
  timezone: z.string().optional(),
});

settingsRouter.patch(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = updateSchema.parse(req.body);
    const client = await pool.connect();
    try {
      await client.query("begin");
      if (body.name || body.avatarUrl) {
        await client.query(
          `update users set name = coalesce($2, name), avatar_url = coalesce($3, avatar_url) where id = $1`,
          [req.user!.id, body.name ?? null, body.avatarUrl ?? null]
        );
      }
      const settingsResult = await client.query(
        `update user_settings set
           theme = coalesce($2, theme),
           notifications_enabled = coalesce($3, notifications_enabled),
           timezone = coalesce($4, timezone),
           updated_at = now()
         where user_id = $1 returning *`,
        [req.user!.id, body.theme ?? null, body.notificationsEnabled ?? null, body.timezone ?? null]
      );
      await client.query("commit");
      res.json(settingsResult.rows[0]);
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  })
);
