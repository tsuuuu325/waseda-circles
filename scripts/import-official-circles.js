/**
 * 2025年度公認サークル477件をDBに追加する（既存データは削除しない）。
 *
 * 使い方（ローカル）:
 *   node scripts/import-official-circles.js
 *
 * 使い方（本番 Turso）:
 *   DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/import-official-circles.js
 */

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { describeTarget, loadEnvFile } = require("./env-utils");

if (process.env.FORCE_LOCAL_SQLITE === "1") {
  process.env.DATABASE_URL = "file:./dev.db";
  delete process.env.TURSO_AUTH_TOKEN;
} else {
  loadEnvFile();
}

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
const DATA_PATH = path.join(__dirname, "..", "prisma", "official-circles-2025.json");

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(
      `${DATA_PATH} がありません。先に node scripts/parse-official-circles.js を実行してください。`
    );
  }

  const { circles, source, updatedAt, total } = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  if (!Array.isArray(circles) || circles.length === 0) {
    throw new Error("インポートするサークルデータがありません。");
  }

  console.log(`データソース: ${source}`);
  console.log(`更新日: ${updatedAt}`);
  console.log(`接続先: ${describeTarget().label}`);
  console.log(`登録予定: ${total ?? circles.length} 件\n`);

  const existing = await prisma.circle.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((c) => c.name));

  let added = 0;
  let skipped = 0;

  for (const circle of circles) {
    if (existingNames.has(circle.name)) {
      skipped += 1;
      continue;
    }

    await prisma.circle.create({
      data: {
        name: circle.name,
        category: circle.category,
        description: circle.description,
      },
    });

    existingNames.add(circle.name);
    added += 1;
  }

  const finalCount = await prisma.circle.count();

  console.log("インポート完了:");
  console.log(`- 新規追加: ${added} 件`);
  console.log(`- スキップ（同名あり）: ${skipped} 件`);
  console.log(`- DB内サークル総数: ${finalCount} 件`);
}

main()
  .catch((error) => {
    console.error("FAILED:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
