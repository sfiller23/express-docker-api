import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import User from "../models/user.model";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const TOKEN_EXPIRE = "1d";

export const register = async (email: string, password: string) => {
  const user = new User({ email, password });
  await user.save();

  return generateToken(user._id.toString());
};

export const login = async (email: string, password: string) => {
  const user = (await User.findOne({ email })) as HydratedDocument<any>;
  if (!user) throw new Error("User not found");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return { accessToken, refreshToken };
};

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};
