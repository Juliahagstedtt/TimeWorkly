import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../data/Jwt.js";

export interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string | null;
  createdAt: string;
}

let times: TimeEntry[] = [];