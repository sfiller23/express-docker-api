import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  console.log("Incoming token:", req.cookies.token);
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    console.log("decoded:", decoded);
    (req as any).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
