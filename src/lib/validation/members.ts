import { z } from "zod";
import { ROLE_CODES } from "@/lib/permissions/matrix";

export const membershipMutationSchema = z
  .object({
    organizationId: z.string().uuid(),
    userId: z.string().uuid("Choose a member."),
    roleCode: z.enum(ROLE_CODES),
    status: z.enum(["active", "inactive", "pending"]).default("active"),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
  })
  .refine((values) => !values.startDate || !values.endDate || values.endDate >= values.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export const invitationSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  roleCode: z.enum(ROLE_CODES),
  expiresAt: z.string().datetime().optional(),
});

export type MembershipMutationValues = z.infer<typeof membershipMutationSchema>;
export type InvitationValues = z.infer<typeof invitationSchema>;
