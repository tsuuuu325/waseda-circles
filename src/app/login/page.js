import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="page">
      <header className="header">
        <h1>ログイン</h1>
        <p>メールアドレスとパスワードでログインしてください</p>
      </header>
      <LoginForm />
    </main>
  );
}
