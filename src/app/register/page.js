import RegisterForm from "../../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="page">
      <header className="header">
        <h1>新規登録</h1>
        <p>@waseda.jp などの早稲田メールアドレスのみ登録できます</p>
      </header>
      <RegisterForm />
    </main>
  );
}
