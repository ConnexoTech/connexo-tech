import { z } from "zod";

// Authentication validation schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Profile validation schemas
export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens");

export const profileUpdateSchema = z.object({
  username: usernameSchema,
  title: z.string().trim().max(100, "Title must be less than 100 characters").optional(),
  bio: z.string().trim().max(500, "Bio must be less than 500 characters").optional(),
  contact_email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255)
    .optional()
    .or(z.literal("")),
  contact_phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  contact_location: z.string().trim().max(100, "Location must be less than 100 characters").optional(),
});

// Link validation schema
export const linkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  url: z.string().trim().url("Invalid URL format"),
  icon_class: z.string().regex(/^[a-z-]+$/, "Invalid icon name").optional(),
});

// Appearance validation schema
export const appearanceSchema = z.object({
  bg_type: z.enum(["color", "image"]),
  bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  button_style: z.enum(["rectangular", "rounded", "pill"]),
  button_bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  button_text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  font_family: z.string(),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

// Password change validation
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
