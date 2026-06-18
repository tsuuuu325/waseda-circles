import Link from "next/link";
import ResendVerificationForm from "../../../components/ResendVerificationForm";

export default async function RegisterSentPage({ searchParams }) {
  const params = await searchParams;
  const email = params.email || "";
  const devLink = params.devLink || "";

  return (
    <main className="page">
      <header className="header">
        <h1>確認メールを送信しました</h1>
        <p>
          <strong>{email}</strong> 宛に認証リンクを送りました。
        </p>
      </header>

      <div className="auth-prompt">
        <p>メール内のリンクを開くと登録が完了します。</p>
        <p className="form-note">1つの早稲田メールアドレスにつき、アカウントは1つだけ作成できます。</p>

        {devLink ? (
          <p className="form-note">
            開発モード：メールが届かない場合は{" "}
            <a href={devLink} className="back-link">
              この認証リンク
            </a>{" "}
            を開いてください。
          </p>
        ) : null}
      </div>

      <section className="review-form-section">
        <h2 className="section-title">メールが届かない場合</h2>
        <ResendVerificationForm defaultEmail={email} />
      </section>

      <Link href="/login" className="back-link">
        認証後にログインする →
      </Link>
    </main>
  );
}
