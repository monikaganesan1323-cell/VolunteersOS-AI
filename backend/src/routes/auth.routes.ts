import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../config/db";
import { env } from "../config/env";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const authRouter = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "program_admin", "volunteer"]).default("volunteer"),
  organizationId: z.string().uuid().optional(),
});

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const body = signupSchema.parse(req.body);
    const existing = await pool.query("select id from users where email = $1", [body.email]);
    if (existing.rowCount) {
      return res.status(409).json({ error: "An account with that email already exists" });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const client = await pool.connect();
    try {
      await client.query("begin");
      const userResult = await client.query(
        `insert into users (name, email, password_hash, role)
         values ($1, $2, $3, $4) returning id, name, email, role, created_at`,
        [body.name, body.email, passwordHash, body.role]
      );
      const user = userResult.rows[0];

      if (body.role === "volunteer") {
        await client.query(
          `insert into volunteers (id, organization_id, status) values ($1, $2, 'pending')`,
          [user.id, body.organizationId ?? null]
        );
      }
      await client.query(`insert into user_settings (user_id) values ($1)`, [user.id]);
      await client.query("commit");

      const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
      res.status(201).json({ token, user });
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const result = await pool.query(
      "select id, name, email, password_hash, role from users where email = $1",
      [body.email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(body.password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    delete user.password_hash;
    res.json({ token, user });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const result = await pool.query(
      "select id, name, email, role, avatar_url, created_at from users where id = $1",
      [req.user!.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  })
);
