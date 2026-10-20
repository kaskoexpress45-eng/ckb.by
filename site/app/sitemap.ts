import { articles } from "@/content/articles";
import type { MetadataRoute } from "next";
import { navigation, siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navigation,
    ["/stati", "Материалы"],
    ...articles.map((a) => [`/stati/${a.slug}`, a.title]),
  ].map(([path]) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/razvitie" ? 0.9 : 0.7,
  }));
}
