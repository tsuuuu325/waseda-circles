"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createReview } from "../app/actions";

export default function ReviewForm({ circleId, isLoggedIn, hasAlreadyReviewed }) {
  const router = useRouter();
  const [rating, setRating] = useState("5");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!isLoggedIn) {
    return (
      <section className="review-form-section">
        <h2 className="section-title">口コミを投稿</h2>
        <div className="auth-prompt">
          <p>口コミを読むのはログイン不要です。投稿するだけログインが必要です。</p>
          <Link href="/login" className="submit-button inline-button">
            ログインする
          </Link>
        </div>
      </section>
    );
  }

  if (hasAlreadyReviewed) {
    return (
      <section className="review-form-section">
        <h2 className="section-title">口コミを投稿</h2>
        <div className="auth-prompt">
          <p>このサークルにはすでに口コミを投稿済みです（1人1件まで）。</p>
          <Link href="/mypage" className="back-link">
            マイページで自分の口コミを見る →
          </Link>
        </div>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    const result = await createReview(circleId, Number(rating), text);

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setText("");
    setRating("5");
    setPending(false);
    router.refresh();
  }

  return (
    <section className="review-form-section">
      <h2 className="section-title">口コミを投稿</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="rating">
          評価
        </label>
        <select
          id="rating"
          className="form-select"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          disabled={pending}
        >
          <option value="5">★★★★★（5）</option>
          <option value="4">★★★★☆（4）</option>
          <option value="3">★★★☆☆（3）</option>
          <option value="2">★★☆☆☆（2）</option>
          <option value="1">★☆☆☆☆（1）</option>
        </select>

        <label className="form-label" htmlFor="text">
          口コミ
        </label>
        <textarea
          id="text"
          className="form-textarea"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="サークルの雰囲気や活動内容などを書いてください"
          rows={4}
          disabled={pending}
        />

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="submit-button" disabled={pending}>
          {pending ? "投稿中..." : "投稿する"}
        </button>
      </form>
      <p className="form-note">1人1サークルにつき1件まで投稿できます</p>
    </section>
  );
}
