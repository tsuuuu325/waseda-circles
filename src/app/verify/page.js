import Link from "next/link";
import { verifyEmailToken } from "../../lib/verification";

export default async function VerifyPage({ searchParams }) {
  const params = await searchParams;
  const token = params.token || "";

  if (!token) {
    return (
      <main className="page">
        <h1>認証リンクが無効です</h1>
        <Link href="/register" className="back-link">
          新規登録に戻る
        </Link>
      </main>
    );
  }

  const result = await verifyEmailToken(token);

  if (result.error) {
    return (
      <main className="page">
        <h1>認証に失敗しました</h1>
        <p className="description">{result.error}</p>
        <Link href="/register" className="back-link">
          新規登録に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <h1>メール認証が完了しました</h1>
        <p>{result.email} のアカウントが有効になりました。</p>
      </header>
      <Link href="/login" className="submit-button inline-button">
        ログインする
      </Link>
    </main>
  );
}
