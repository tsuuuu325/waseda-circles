import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <h1>ページが見つかりません</h1>
      <p className="description">URLが間違っているか、ページが移動した可能性があります。</p>
      <Link href="/" className="back-link">
        ← トップに戻る
      </Link>
    </main>
  );
}
