"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, registerUser, signIn, signOut } from "../auth";
import { prisma } from "../lib/prisma";
import { isValidEmail, normalizeEmail } from "../lib/validators";
import { createVerificationToken, sendVerificationEmail, verifyEmailToken } from "../lib/verification";

export async function registerAction(prevState, formData) {
  const email = String(formData.get("email") || "");
  const name = String(formData.get("name") || "");
  const password = String(formData.get("password") || "");

  const result = await registerUser(email, name, password);

  if (result.error) {
    return result;
  }

  const params = new URLSearchParams({
    email: result.email,
  });

  if (result.verifyUrl) {
    params.set("verifyUrl", result.verifyUrl);
  }

  if (result.emailFailed) {
    params.set("emailFailed", "1");
  }

  redirect(`/register/sent?${params.toString()}`);
}

export async function loginAction(prevState, formData) {
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");

  if (!isValidEmail(email)) {
    return { error: "有効なメールアドレスを入力してください。" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && !user.emailVerified) {
    return { error: "メール認証が完了していません。登録時の確認メールを開いてください。" };
  }

  const signInResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (signInResult?.error) {
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }

  redirect("/");
}

export async function resendVerificationAction(prevState, formData) {
  const email = normalizeEmail(String(formData.get("email") || ""));

  if (!isValidEmail(email)) {
    return { error: "有効なメールアドレスを入力してください。" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "このメールアドレスは登録されていません。" };
  }

  if (user.emailVerified) {
    return { error: "このメールアドレスはすでに認証済みです。ログインしてください。" };
  }

  const token = await createVerificationToken(user.id);
  const emailResult = await sendVerificationEmail(email, token);

  if (!emailResult.success || !emailResult.verifyUrl) {
    return { error: "確認メールの再送に失敗しました。" };
  }

  return {
    success: true,
    verifyUrl: emailResult.verifyUrl,
    emailFailed: emailResult.emailFailed || false,
  };
}

export async function verifyEmailAction(token) {
  return verifyEmailToken(token);
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function createReview(circleId, rating, text) {
  const session = await auth();
  const trimmedText = text.trim();

  if (!session?.user?.id) {
    return { error: "口コミを投稿するにはログインが必要です。" };
  }

  if (!trimmedText || rating < 1 || rating > 5) {
    return { error: "口コミを入力してください。" };
  }

  const existing = await prisma.review.findFirst({
    where: {
      circleId,
      userId: session.user.id,
    },
  });

  if (existing) {
    return { error: "このサークルにはすでに口コミを投稿しています。1人1件までです。" };
  }

  await prisma.review.create({
    data: {
      circleId,
      userId: session.user.id,
      rating,
      text: trimmedText,
    },
  });

  revalidatePath(`/circle/${circleId}`);
  revalidatePath("/");
  revalidatePath("/mypage");

  return { success: true };
}

export async function createCircle(prevState, formData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "サークルを追加するにはログインが必要です。" };
  }

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !category || !description) {
    return { error: "すべての項目を入力してください。" };
  }

  const circle = await prisma.circle.create({
    data: {
      name,
      category,
      description,
      createdById: session.user.id,
    },
  });

  revalidatePath("/");

  return { success: true, circleId: circle.id };
}
