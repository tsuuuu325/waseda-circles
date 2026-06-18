import CircleForm from "../../../components/CircleForm";

export default function NewCirclePage() {
  return (
    <main className="page">
      <header className="header">
        <h1>サークルを追加</h1>
        <p>まだ登録されていないサークルを追加できます</p>
      </header>
      <CircleForm />
    </main>
  );
}
