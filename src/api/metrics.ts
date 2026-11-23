import { Request, Response } from "express";
import { config } from "../config.js";

export const handleMetrics = (req: Request, res: Response) => {
    const NumberOfVisits = config.fileServerHits;
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`
    <html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${NumberOfVisits} times!</p>
        </body>
    </html>`);
};
