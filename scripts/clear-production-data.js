const { PrismaClient } = require("@prisma/client");

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "";

  if (
    url.startsWith("libsql://") ||
    url.startsWith("libsqls://") ||
    url.includes(".turso.io")
  ) {
    if (!process.env.TURSO_AUTH_TOKEN) {
      throw new Error("TURSO_AUTH_TOKEN が設定されていません。");
    }

    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSQL({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

const prisma = createPrismaClient();

async function main() {
  const reviewCount = await prisma.review.deleteMany();
  const circleCount = await prisma.circle.deleteMany();
  const tokenCount = await prisma.verificationToken.deleteMany();
  const userCount = await prisma.user.deleteMany();

  console.log("削除しました:");
  console.log(`- 口コミ: ${reviewCount.count} 件`);
  console.log(`- サークル: ${circleCount.count} 件`);
  console.log(`- 認証トークン: ${tokenCount.count} 件`);
  console.log(`- ユーザー: ${userCount.count} 件`);
  console.log("\n本番DBは空の状態です。サークル一覧は0件になります。");
}

main()
  .catch((error) => {
    console.error("FAILED:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
