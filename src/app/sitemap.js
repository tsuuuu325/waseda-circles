import { getSiteUrl } from "../lib/site";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getStaticPages(baseUrl) {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}

export default async function sitemap() {
  const baseUrl = getSiteUrl();
  const staticPages = getStaticPages(baseUrl);

  try {
    const circles = await prisma.circle.findMany({
      select: { id: true, createdAt: true },
      orderBy: { id: "asc" },
    });

    const circlePages = circles.map((circle) => ({
      url: `${baseUrl}/circle/${circle.id}`,
      lastModified: circle.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...circlePages];
  } catch (error) {
    console.error("Failed to build sitemap from database:", error);
    return staticPages;
  }
}
