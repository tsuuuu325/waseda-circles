const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");

const prisma = new PrismaClient();

const email = "finalcheck@waseda.jp";
const password = "testpass123";
const name = "最終確認ユーザー";

async function verifyEmailToken(token) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    return { error: "認証リンクが無効です。" };
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

async function main() {
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 10),
    },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  console.log("1. 登録 OK:", email);

  const verifyResult = await verifyEmailToken(token);
  console.log("2. メール認証:", verifyResult.success ? "OK" : verifyResult.error);

  const circle = await prisma.circle.findFirst();
  if (!circle) {
    throw new Error("サークルがありません。npm run db:seed を実行してください。");
  }

  await prisma.review.deleteMany({
    where: { userId: user.id, circleId: circle.id },
  });

  await prisma.review.create({
    data: {
      circleId: circle.id,
      userId: user.id,
      rating: 5,
      text: "公開前の最終確認口コミです。",
    },
  });

  console.log("3. 口コミ投稿 OK:", circle.name);

  try {
    await prisma.review.create({
      data: {
        circleId: circle.id,
        userId: user.id,
        rating: 4,
        text: "2件目（失敗するはず）",
      },
    });
    console.log("4. 1人1口コミ制限: NG（2件目が通ってしまった）");
  } catch {
    console.log("4. 1人1口コミ制限: OK（2件目は拒否）");
  }

  const verified = await prisma.user.findUnique({ where: { email } });
  console.log("5. 認証済みフラグ:", verified?.emailVerified ? "OK" : "NG");
  console.log("\nすべての最終確認が完了しました。");
}

main()
  .catch((error) => {
    console.error("FAILED:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
