import { z } from "zod";
import { SKILL_LEVELS, SPORTS } from "./constants";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const createGameSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  sport: z.enum(SPORTS),
  location: z.string().min(2, "Location is required"),
  address: z.string().optional(),
  dateTime: z.string().min(1, "Date and time are required"),
  maxPlayers: z.coerce.number().int().min(2).max(100),
  skillLevel: z.enum(SKILL_LEVELS),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
});

export const gameFiltersSchema = z.object({
  sport: z.string().optional(),
  location: z.string().optional(),
  q: z.string().optional(),
});
