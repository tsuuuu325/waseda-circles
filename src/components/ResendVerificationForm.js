"use client";

import { useActionState } from "react";

const initialState = { error: "", success: false, verifyUrl: "" };

export default function ResendVerificationForm({ defaultEmail = "" }) {
  const [state, formAction, pending] = useActionState(
    async (prevState, formData) => {
      const { resendVerificationAction } = await import("../app/actions");
      return resendVerificationAction(prevState, formData);
    },
    initialState,
  );

  return (
    <form className="review-form auth-form" action={formAction}>
      <label className="form-label" htmlFor="resend-email">
        メールアドレス
      </label>
      <input
        id="resend-email"
        name="email"
        type="email"
        className="form-input"
        defaultValue={defaultEmail}
        required
      />

      {state?.error ? <p className="form-error">{state.error}</p> : null}
      {state?.success ? <p className="form-note">確認メールを再送しました。</p> : null}
      {state?.verifyUrl ? (
        <p className="form-note">
          メールが届かない場合は{" "}
          <a href={state.verifyUrl} className="back-link">
            認証リンクを開く
          </a>
        </p>
      ) : null}

      <button type="submit" className="submit-button" disabled={pending}>
        {pending ? "送信中..." : "確認メールを再送する"}
      </button>
    </form>
  );
}
