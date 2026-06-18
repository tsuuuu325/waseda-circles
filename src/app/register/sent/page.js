import Link from "next/link";
import ResendVerificationForm from "../../../components/ResendVerificationForm";

export default async function RegisterSentPage({ searchParams }) {
  const params = await searchParams;
  const email = params.email || "";
  const verifyUrl = params.verifyUrl || params.devLink || "";
  const emailFailed = params.emailFailed === "1";

  return (
    <main className="page">
      <header className="header">
        <h1>{emailFailed ? "登録が完了しました" : "確認メールを送信しました"}</h1>
        <p>
          <strong>{email}</strong>
          {emailFailed ? " のアカウントを作成しました。" : " 宛に認証リンクを送りました。"}
        </p>
      </header>

      <div className="auth-prompt">
        {emailFailed ? (
          <p>メール送信はできませんでした。下のリンクからメール認証を完了してください。</p>
        ) : (
          <p>メール内のリンクを開くと登録が完了します。</p>
        )}
        <p className="form-note">1つのメールアドレスにつき、アカウントは1つだけ作成できます。</p>

        {verifyUrl ? (
          <p className="form-note">
            {emailFailed ? "認証リンク：" : "メールが届かない場合は "}
            <a href={verifyUrl} className="back-link">
              この認証リンク
            </a>
            {emailFailed ? "" : " を開いてください。"}
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
