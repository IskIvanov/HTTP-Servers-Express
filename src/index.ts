import postgres from "postgres";
import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import errorHandler, { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handleMetrics } from "./api/metrics.js";
import { handleReset } from "./api/reset.js";
import { handleValidate } from "./api/validate.js";
import { config } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handleCreateUser } from "./api/create.js";
import { handleDeleteAllUsers } from "./api/resetUsers.js";

const migrationClient = postgres(config.db.url, {max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use(express.json())
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handleValidate)
app.post("/api/users", handleCreateUser);
app.post("/api/reset", handleDeleteAllUsers);
app.get("/admin/metrics", handleMetrics);
app.post("/admin/reset", handleReset);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
