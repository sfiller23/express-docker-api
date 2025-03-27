import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service";
import { generateAccessToken } from "../services/auth.service";

const COOKIE_CONFIG = {
  httpOnly: true,
  sameSite: "lax" as "lax",
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
    const { accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    res
      .cookie("token", accessToken, {
        ...COOKIE_CONFIG,
        maxAge: 15 * 60 * 1000, // 15 דקות
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_CONFIG,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ימים
      })
      .json({ success: true });
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
    ...COOKIE_CONFIG,
  });
  res.clearCookie("refreshToken", {
    ...COOKIE_CONFIG,
  });
  res.json({ success: true });
};

export const me = async (req: Request, res: Response) => {
  res.json((req as any).userId);
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (typeof decoded === "object" && "userId" in decoded) {
      const newAccessToken = generateAccessToken(decoded.userId);
      res
        .cookie("token", newAccessToken, {
          ...COOKIE_CONFIG,
          maxAge: 15 * 60 * 1000,
        })
        .json({ success: true });
    } else {
      throw new Error("Invalid token payload");
    }
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};
