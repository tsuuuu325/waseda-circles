import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "早稲田サークル口コミ",
  description: "早稲田大学のサークル口コミ掲示板",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
