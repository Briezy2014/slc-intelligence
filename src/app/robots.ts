import type { MetadataRoute } from "next";
import { CANONICAL_PRODUCTION_URL } from "@/lib/constants/product";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_APP_URL || CANONICAL_PRODUCTION_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/privacy",
          "/terms",
          "/accessibility",
          "/support",
          "/sign-in",
          "/forgot-password",
        ],
        disallow: [
          "/command-center",
          "/students",
          "/schools",
          "/programs",
          "/classrooms",
          "/staff",
          "/goals",
          "/progress",
          "/reports",
          "/behavior-detective",
          "/interventions",
          "/accommodations",
          "/services",
          "/family-communication",
          "/meetings",
          "/executive-function",
          "/classroom-operations",
          "/administrative-intelligence",
          "/ai-assist",
          "/organization",
          "/account",
          "/api",
          "/auth",
          "/select-organization",
          "/membership-pending",
          "/unauthorized",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${host.replace(/\/$/, "")}/sitemap.xml`,
    host,
  };
}
