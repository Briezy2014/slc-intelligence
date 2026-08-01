import type { MetadataRoute } from "next";
import { CANONICAL_PRODUCTION_URL } from "@/lib/constants/product";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL || CANONICAL_PRODUCTION_URL).replace(/\/$/, "");
  const paths = [
    "",
    "/about",
    "/capabilities",
    "/pricing",
    "/privacy",
    "/terms",
    "/accessibility",
    "/support",
    "/sign-in",
    "/forgot-password",
  ];
  return paths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
