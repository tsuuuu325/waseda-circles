import "./globals.css";
import Header from "../components/Header";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { SITE_DESCRIPTION, SITE_NAME } from "../lib/site";

export const metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  verification: {
    google: "2NvIAGwDmZXeC4o2cwbQVFnkNAlJhlYflPf9gwtigsY",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <GoogleAnalytics />
        <Header />
        {children}
      </body>
    </html>
  );
}
