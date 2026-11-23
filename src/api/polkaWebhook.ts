import type { NextFunction, Request, Response } from "express";
import { updateToChirpyRed } from "../db/queries/upgradeToRed.js";
import { NotFoundError } from "./errors.js";

type PolkaWebhookBody = {
    event: string;
    data: { userId: string };
};

export const handlePolkaWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { event, data } = (req.body ?? {}) as Partial<PolkaWebhookBody>;

        // Acknowledge events we don't handle so Polka stops retrying
        if (event !== "user.upgraded") {
            res.sendStatus(204);
            return;
        }

        const user = data?.userId ? await updateToChirpyRed(data.userId) : undefined;
        if (!user) {
            throw new NotFoundError("User not found");
        }

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};
