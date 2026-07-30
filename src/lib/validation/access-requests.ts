import { z } from "zod";
import { ROLE_CODES } from "@/lib/permissions/matrix";

const requestableRoles = ROLE_CODES.filter((code) => code !== "platform_admin");

export const REQUESTABLE_ROLE_CODES = requestableRoles;

export const accessRequestSignupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid work email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(1, "Confirm your password."),
  organizationSlug: z
    .string()
    .trim()
    .min(2, "Enter the organization code provided by your administrator.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Organization code can only include letters, numbers, and hyphens."),
  requestedRoleCodes: z
    .array(z.enum(ROLE_CODES))
    .min(1, "Select at least one role.")
    .refine((roles) => roles.every((role) => role !== "platform_admin"), {
      message: "That role cannot be requested.",
    }),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords must match.",
  path: ["confirmPassword"],
});

export const reviewAccessRequestSchema = z.object({
  organizationId: z.string().uuid(),
  requestId: z.string().uuid(),
  decision: z.enum(["approved", "denied"]),
  grantedRoleCode: z
    .string()
    .optional()
    .refine((value) => value == null || value === "" || (ROLE_CODES as readonly string[]).includes(value), {
      message: "Choose a valid role.",
    }),
  reviewNote: z.string().trim().max(1000).optional().or(z.literal("")),
});
