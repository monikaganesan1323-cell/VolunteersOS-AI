import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const chatbotRouter = Router();
chatbotRouter.use(requireAuth);

chatbotRouter.get(
  "/messages",
  asyncHandler(async (req: AuthedRequest, res) => {
    const result = await pool.query(
      `select id, role, content, created_at from chatbot_messages where user_id = $1 order by created_at asc`,
      [req.user!.id]
    );
    res.json(result.rows);
  })
);

const sendSchema = z.object({ content: z.string().min(1) });

// Stores the user's message and a placeholder assistant reply.
// Swap the reply generation for a real AI call (OpenAI/Anthropic/etc.) when ready.
chatbotRouter.post(
  "/messages",
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = sendSchema.parse(req.body);
    const client = await pool.connect();
    try {
      await client.query("begin");
      const userMsg = await client.query(
        `insert into chatbot_messages (user_id, role, content) values ($1, 'user', $2) returning *`,
        [req.user!.id, body.content]
      );

      const replyText = `Got it — you said: "${body.content}". Hook this endpoint up to a real AI model to generate smarter replies.`;
      const assistantMsg = await client.query(
        `insert into chatbot_messages (user_id, role, content) values ($1, 'assistant', $2) returning *`,
        [req.user!.id, replyText]
      );
      await client.query("commit");

      res.status(201).json({ userMessage: userMsg.rows[0], assistantMessage: assistantMsg.rows[0] });
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  })
);
