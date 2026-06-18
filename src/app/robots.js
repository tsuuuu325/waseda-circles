import { getSiteUrl } from "../lib/site";

export default function robots() {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mypage", "/circles/new", "/register/sent", "/verify"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
