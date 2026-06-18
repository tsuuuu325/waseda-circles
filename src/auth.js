import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";
import { isValidEmail, normalizeEmail } from "./lib/validators";
import { createVerificationToken, sendVerificationEmail } from "./lib/verification";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(String(credentials?.email || ""));
        const password = String(credentials?.password || "");

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
});

export async function registerUser(email, name, password) {
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = name.trim();

  if (!isValidEmail(normalizedEmail)) {
    return { error: "有効なメールアドレスを入力してください。" };
  }

  if (!trimmedName) {
    return { error: "ニックネームを入力してください。" };
  }

  if (password.length < 8) {
    return { error: "パスワードは8文字以上にしてください。" };
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    if (!existing.emailVerified) {
      return { error: "このメールアドレスは登録済みです。確認メールのリンクを開いてください。" };
    }

    return { error: "このメールアドレスはすでに登録されています。1人1アカウントです。" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: trimmedName,
      password: hashedPassword,
    },
  });

  const token = await createVerificationToken(user.id);
  const emailResult = await sendVerificationEmail(normalizedEmail, token);

  if (emailResult.error) {
    await prisma.user.delete({ where: { id: user.id } });
    return { error: emailResult.error };
  }

  return {
    success: true,
    email: normalizedEmail,
    verifyUrl: emailResult.verifyUrl || null,
  };
}
