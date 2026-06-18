/**
 * ローカル SQLite（prisma/dev.db）に477件を追加する。
 * .env が Turso でも、必ず dev.db に入れます。
 *
 * 使い方:
 *   npm run db:import:circles:local
 */

process.env.FORCE_LOCAL_SQLITE = "1";
require("./import-official-circles.js");
