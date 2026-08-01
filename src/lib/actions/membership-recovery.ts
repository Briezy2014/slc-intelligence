"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  GENERIC_ACTION_MESSAGE,
  type ActionState,
  VALIDATION_ACTION_MESSAGE,
} from "@/lib/actions/shared";
import { requireUser } from "@/lib/auth/session";
import { isServerSupabaseConfigured } from "@/lib/env";
import { SELECTED_ORGANIZATION_COOKIE, listMembershipsForUser } from "@/lib/org/context";
import { createClient } from "@/lib/supabase/server";

type RecoveryRow = {
  membership_id: string;
  organization_id: string;
  organization_name: string;
  role_code: string;
  status: string;
};

async function setOrgCookie(organizationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SELECTED_ORGANIZATION_COOKIE, organizationId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function restoreOwnerMembershipAction(): Promise<ActionState> {
  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }

  const user = await requireUser("/membership-pending");
  const supabase = await createClient();

  try {
    // 1) Reactivate any organization_admin membership for this user.
    const activate = await supabase.rpc("activate_own_organization_admin_membership");
    if (activate.error) {
      return {
        status: "error",
        message:
          "Could not restore owner access yet. Run the latest Supabase SQL migration (owner membership recovery), then try again.",
      };
    }

    let rows = (activate.data ?? []) as RecoveryRow[];

    // 2) If this account has no memberships and the tenant has a single org with no admin, claim it.
    if (!rows.length) {
      const memberships = await listMembershipsForUser(user.id);
      if (memberships.length === 0) {
        const claim = await supabase.rpc("claim_sole_organization_as_admin");
        if (claim.error) {
          return {
            status: "error",
            message:
              "Could not claim organization owner access. Confirm the SQL migration is applied, then retry.",
          };
        }
        rows = (claim.data ?? []) as RecoveryRow[];
      }
    }

    if (!rows.length) {
      return {
        status: "error",
        message:
          "No organization admin membership was found for this account. In Supabase, confirm organization_memberships has your user_id with role_code organization_admin and status active.",
      };
    }

    const primary = rows[0];
    if (!primary?.organization_id) {
      return { status: "error", message: VALIDATION_ACTION_MESSAGE };
    }

    await setOrgCookie(primary.organization_id);
    redirect("/command-center");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
