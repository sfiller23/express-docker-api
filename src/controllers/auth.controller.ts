import { Request, Response } from "express";
import * as authService from "../services/auth.service";

const COOKIE_CONFIG = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.register(email, password);
    res.cookie("token", token, { httpOnly: true }).json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.cookie("token", token, { httpOnly: true }).json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true });
};

export const me = async (req: Request, res: Response) => {
  res.json((req as any).userId);
};
