const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { describeTarget, loadEnvFile } = require("./env-utils");

loadEnvFile();

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "";

  if (
    url.startsWith("libsql://") ||
    url.startsWith("libsqls://") ||
    url.includes(".turso.io")
  ) {
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSQL({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

async function main() {
  const jsonPath = path.join(__dirname, "..", "prisma", "official-circles-2025.json");
  const target = describeTarget();

  console.log("=== DB 状態 ===");
  console.log("接続先 (.env):", target.label);
  console.log("official-circles-2025.json:", fs.existsSync(jsonPath) ? "あり" : "なし");
  console.log("prisma/dev.db:", fs.existsSync(path.join(__dirname, "..", "prisma", "dev.db")) ? "あり" : "なし");

  const prisma = createPrismaClient();
  const count = await prisma.circle.count();
  console.log("現在のサークル件数:", count);

  if (target.label.startsWith("Turso")) {
    console.log("\n※ .env が Turso のため、npm run dev も Turso を見ています。");
    console.log("  ローカル dev.db に入れたい場合 → npm run db:import:circles:local");
    console.log("  Turso に入れたい場合 → npm run db:import:circles");
  } else if (count === 0) {
    console.log("\n※ サークル0件です。次を実行してください → npm run db:import:circles:local");
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("FAILED:", error.message);
  process.exit(1);
});
