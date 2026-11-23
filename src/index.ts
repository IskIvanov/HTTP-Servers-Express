import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { handleCreateUser } from "./api/create.js";
import { handleCreateChirp } from "./api/createChirp.js";
import { handleGetChirps } from "./api/getChirps.js";
import { handleGetChirpsById } from "./api/getChirpsById.js";
import { handleMetrics } from "./api/metrics.js";
import errorHandler, { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handleReset } from "./api/reset.js";
import { handleDeleteAllUsers } from "./api/resetUsers.js";
import { handleUserLogin } from "./api/userLogin.js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;
app.use(middlewareLogResponse);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// TODO: Add a resolver to all the handlers in the route.
app.get("/api/healthz", handlerReadiness);

app.post("/api/users", handleCreateUser);
app.post("/api/reset", handleDeleteAllUsers);
app.post("/api/chirps", handleCreateChirp);

app.get("/api/chirps", handleGetChirps);
app.get("/api/chirps/:id", handleGetChirpsById);

app.post("/admin/reset", handleReset);

app.get("/admin/metrics", handleMetrics);

app.post("/api/login", handleUserLogin);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
