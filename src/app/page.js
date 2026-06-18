import CircleList from "../components/CircleList";
import { getAllCircles } from "../lib/db";

export default async function Home() {
  const circles = await getAllCircles();

  return (
    <main className="page">
      <header className="header">
        <h1>早稲田サークル口コミ</h1>
        <p>在学生の口コミで、サークル選びをサポート</p>
      </header>

      <CircleList circles={circles} />

      <p className="footer-note">Phase 3：ログイン・サークル追加・DB保存に対応</p>
    </main>
  );
}
