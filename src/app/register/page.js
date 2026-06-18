import RegisterForm from "../../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="page">
      <header className="header">
        <h1>新規登録</h1>
        <p>メールアドレスでアカウントを作成できます</p>
      </header>
      <RegisterForm />
    </main>
  );
}
