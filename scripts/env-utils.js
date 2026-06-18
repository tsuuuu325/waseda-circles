const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");

    if (eq === -1) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function detectDbType(url) {
  if (!url) {
    return "未設定";
  }

  if (url.startsWith("file:")) {
    return "ローカル SQLite（dev.db）";
  }

  if (url.startsWith("libsql://") || url.startsWith("libsqls://") || url.includes(".turso.io")) {
    return "Turso（クラウドDB）";
  }

  return "その他";
}

function describeTarget() {
  loadEnvFile();
  const url = process.env.DATABASE_URL || "";
  return {
    url,
    label: detectDbType(url),
  };
}

module.exports = {
  loadEnvFile,
  detectDbType,
  describeTarget,
};
