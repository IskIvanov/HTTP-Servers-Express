import express from "express";
import type {Request, Response} from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handleMetrics } from "./api/metrics.js";
import { handleReset } from "./api/reset.js";
import { handleValidate } from "./api/validate.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handleValidate)
app.get("/admin/metrics", handleMetrics);
app.post("/admin/reset", handleReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
