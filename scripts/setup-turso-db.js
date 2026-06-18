const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

const url = process.env.DATABASE_URL || "";
const authToken = process.env.TURSO_AUTH_TOKEN || "";

if (!url.startsWith("libsql://") && !url.startsWith("libsqls://") && !url.includes(".turso.io")) {
  console.error("DATABASE_URL が Turso の URL ではありません。");
  console.error("libsql:// または https://....turso.io の URL を設定してください。");
  process.exit(1);
}

if (!authToken) {
  console.error("TURSO_AUTH_TOKEN が設定されていません。");
  process.exit(1);
}

const migrationsDir = path.join(__dirname, "..", "prisma", "migrations");
const migrationFolders = fs
  .readdirSync(migrationsDir)
  .filter((name) => fs.statSync(path.join(migrationsDir, name)).isDirectory())
  .sort();

async function main() {
  const client = createClient({ url, authToken });

  console.log("Turso にテーブルを作成します...");

  for (const folder of migrationFolders) {
    const sqlPath = path.join(migrationsDir, folder, "migration.sql");
    if (!fs.existsSync(sqlPath)) {
      continue;
    }

    const sql = fs.readFileSync(sqlPath, "utf8");
    const statements = sql
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean);

    console.log(`- ${folder}`);

    for (const statement of statements) {
      await client.execute(`${statement};`);
    }
  }

  console.log("初期データを入れます...");
  const { execSync } = require("child_process");
  execSync("node prisma/seed.js", { stdio: "inherit", env: process.env });
  console.log("完了しました。");
}

main().catch((error) => {
  console.error("FAILED:", error.message);
  process.exit(1);
});
