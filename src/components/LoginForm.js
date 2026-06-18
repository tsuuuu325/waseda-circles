"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "../app/actions";

const initialState = { error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="review-form auth-form" action={formAction}>
      <label className="form-label" htmlFor="email">
        早稲田メールアドレス
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className="form-input"
        placeholder="example@waseda.jp"
        required
      />

      <label className="form-label" htmlFor="password">
        パスワード
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className="form-input"
        required
      />

      {state?.error ? <p className="form-error">{state.error}</p> : null}

      <button type="submit" className="submit-button" disabled={pending}>
        {pending ? "ログイン中..." : "ログイン"}
      </button>

      <p className="form-note">
        アカウントがない方は <Link href="/register">新規登録</Link>
      </p>
    </form>
  );
}
