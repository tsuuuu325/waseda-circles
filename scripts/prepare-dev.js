const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function killPort(port) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr ":${port}"`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      });

      const pids = new Set();

      for (const line of output.split("\n")) {
        if (!line.includes("LISTENING")) {
          continue;
        }

        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];

        if (pid && pid !== "0") {
          pids.add(pid);
        }
      }

      for (const pid of pids) {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped process ${pid} on port ${port}`);
      }

      return;
    }

    execSync(`npx --yes kill-port ${port}`, { stdio: "inherit" });
  } catch {
    // Port may already be free.
  }
}

killPort(3000);
killPort(3001);

const nextDir = path.join(__dirname, "..", ".next");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache");
}

console.log("Ready. Start the server with: npm run dev");
