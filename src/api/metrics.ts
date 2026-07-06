import {Request, Response} from 'express'
import { config } from '../config.js';

export const handleMetrics = (req: Request, res: Response) => {
  res.send(`Hits: ${config.fileServerHits}`)
}
