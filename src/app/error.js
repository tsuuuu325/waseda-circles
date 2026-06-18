"use client";

export default function Error({ error, reset }) {
  return (
    <main className="page">
      <h1>エラーが発生しました</h1>
      <p className="description">ページの読み込みに失敗しました。もう一度お試しください。</p>
      <button type="button" className="submit-button" onClick={() => reset()}>
        再読み込み
      </button>
    </main>
  );
}
