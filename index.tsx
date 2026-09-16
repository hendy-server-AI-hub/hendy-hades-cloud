// index.tsx
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Import các router con (bạn sẽ tạo các file này sau)
import botRouter from "./routes/bots";
import reportRouter from "./routes/reports";

const app = new Hono();

// Middleware: Bật CORS và Ghi log mọi request
app.use("/*", cors());
app.use("/*", logger());

// Health Check API (như cũ)
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: Date.now() }));

// Gắn các router con vào nhánh chính
app.route("/api/bots", botRouter);
app.route("/api/reports", reportRouter);

Bun.serve({
  port: import.meta.env.PORT ?? 3000,
  fetch: app.fetch,
});
console.log("🚀 Bun Server đang chạy!");
