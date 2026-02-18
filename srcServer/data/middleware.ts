import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../data/Jwt.js";

export interface AuthRequest extends Request {
    userId?: string;
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ error: "Token saknas" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
    return res.status(401).json({ error: "Token saknas" });
    }

    try {
        const payload = verifyToken(token);
        req.userId = payload.userId;
        next();
    } catch {
        return res.status(401).send({ error: "Ogiltig token" });
    }
}


export interface TimeEntry {
  id: string;
  userId: string;  
  startTime: string;
  endTime: string | null;
  createdAt: string;
}
