import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import { authRouter } from "./routes/auth.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { volunteersRouter } from "./routes/volunteers.routes";
import { eventsRouter } from "./routes/events.routes";
import { organizationsRouter } from "./routes/organizations.routes";
import { attendanceRouter } from "./routes/attendance.routes";
import { certificatesRouter } from "./routes/certificates.routes";
import { analyticsRouter } from "./routes/analytics.routes";
import { leaderboardRouter } from "./routes/leaderboard.routes";
import { chatbotRouter } from "./routes/chatbot.routes";
import { settingsRouter } from "./routes/settings.routes";

const app = express();

app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// One route file per sidebar feature: Dashboard -> Settings
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/volunteers", volunteersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/organizations", organizationsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/settings", settingsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`VolunteerOS API listening on http://localhost:${env.port}`);
});
