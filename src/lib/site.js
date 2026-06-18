export const SITE_NAME = "ワセクチ";
export const SITE_DESCRIPTION = "早稲田大学のサークル口コミ掲示板";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
