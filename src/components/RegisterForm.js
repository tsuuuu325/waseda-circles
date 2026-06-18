"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "../app/actions";

const initialState = { error: "" };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form className="review-form auth-form" action={formAction}>
      <label className="form-label" htmlFor="email">
        メールアドレス
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className="form-input"
        placeholder="example@example.com"
        required
      />

      <label className="form-label" htmlFor="name">
        ニックネーム
      </label>
      <input
        id="name"
        name="name"
        type="text"
        className="form-input"
        placeholder="表示名"
        required
      />

      <label className="form-label" htmlFor="password">
        パスワード（8文字以上）
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className="form-input"
        minLength={8}
        required
      />

      {state?.error ? <p className="form-error">{state.error}</p> : null}

      <button type="submit" className="submit-button" disabled={pending}>
        {pending ? "登録中..." : "登録する"}
      </button>

      <p className="form-note">
        登録後、確認メールが届きます。1メール1アカウントです。
      </p>
      <p className="form-note">
        すでにアカウントがある方は <Link href="/login">ログイン</Link>
      </p>
    </form>
  );
}
