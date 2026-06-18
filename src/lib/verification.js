import { randomBytes } from "crypto";
import { prisma } from "./prisma";

const TOKEN_HOURS = 24;

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function createVerificationToken(userId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { userId } });

  await prisma.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyEmailToken(token) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    return { error: "認証リンクが無効です。" };
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return { error: "認証リンクの有効期限が切れています。再度登録してください。" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { id: record.id } }),
  ]);

  return { success: true, email: record.user.email };
}

export async function sendVerificationEmail(email, token) {
  const verifyUrl = `${getAppUrl()}/verify?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject: "【早稲田サークル口コミ】メールアドレスの確認",
        html: `
          <p>早稲田サークル口コミへの登録ありがとうございます。</p>
          <p>以下のリンクをクリックして、メールアドレスを確認してください。</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>リンクの有効期限は24時間です。</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send verification email", errorText);
      return {
        error: "確認メールの送信に失敗しました。時間をおいて再度お試しください。",
        verifyUrl,
      };
    }

    return { success: true, verifyUrl };
  }

  console.log(`[開発用] メール認証リンク: ${verifyUrl}`);
  return { success: true, verifyUrl };
}
