"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createCircle } from "../app/actions";

const initialState = { error: "" };

export default function CircleForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCircle, initialState);

  useEffect(() => {
    if (state?.success && state?.circleId) {
      router.push(`/circle/${state.circleId}`);
    }
  }, [state, router]);

  return (
    <form className="review-form auth-form" action={formAction}>
      <label className="form-label" htmlFor="name">
        サークル名
      </label>
      <input id="name" name="name" type="text" className="form-input" required />

      <label className="form-label" htmlFor="category">
        カテゴリ
      </label>
      <select id="category" name="category" className="form-select" required>
        <option value="">選択してください</option>
        <option value="体育系">体育系</option>
        <option value="文化系">文化系</option>
        <option value="その他">その他</option>
      </select>

      <label className="form-label" htmlFor="description">
        説明
      </label>
      <textarea
        id="description"
        name="description"
        className="form-textarea"
        rows={4}
        placeholder="どんなサークルか簡単に書いてください"
        required
      />

      {state?.error ? <p className="form-error">{state.error}</p> : null}

      <button type="submit" className="submit-button" disabled={pending}>
        {pending ? "追加中..." : "サークルを追加"}
      </button>
    </form>
  );
}
