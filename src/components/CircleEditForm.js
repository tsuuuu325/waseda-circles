"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateCircle } from "../app/actions";

export default function CircleEditForm({ circleId, category, description, isLoggedIn }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [editedDescription, setEditedDescription] = useState(description);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSelectedCategory(category);
    setEditedDescription(description);
  }, [category, description, circleId]);

  if (!isLoggedIn) {
    return (
      <section className="review-form-section">
        <h2 className="section-title">サークル情報を編集</h2>
        <div className="auth-prompt">
          <p>カテゴリと説明を変更するにはログインが必要です。</p>
          <Link href="/login" className="submit-button inline-button">
            ログインする
          </Link>
        </div>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess(false);

    const result = await updateCircle(circleId, selectedCategory, editedDescription);

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
    router.refresh();
  }

  return (
    <section className="review-form-section">
      <h2 className="section-title">サークル情報を編集</h2>
      <p className="form-note">ログイン中なら、誰が追加したサークルでもカテゴリと説明を変更できます。</p>

      <form className="review-form" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="edit-category">
          カテゴリ
        </label>
        <select
          id="edit-category"
          name="category"
          className="form-select"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          required
          disabled={pending}
        >
          <option value="体育系">体育系</option>
          <option value="文化系">文化系</option>
          <option value="その他">その他</option>
        </select>

        <label className="form-label" htmlFor="edit-description">
          説明
        </label>
        <textarea
          id="edit-description"
          name="description"
          className="form-textarea"
          rows={4}
          value={editedDescription}
          onChange={(event) => setEditedDescription(event.target.value)}
          placeholder="どんなサークルか簡単に書いてください"
          required
          disabled={pending}
        />

        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">保存しました。ページ上部の表示も更新されています。</p> : null}

        <button type="submit" className="submit-button" disabled={pending}>
          {pending ? "保存中..." : "変更を保存"}
        </button>
      </form>
    </section>
  );
}
