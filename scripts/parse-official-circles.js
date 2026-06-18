/**
 * 早稲田大学 2025年度公認サークル一覧（PDF）から JSON を生成する。
 * 元データ: https://www.waseda.jp/inst/student/assets/uploads/2025/06/officialcircle_list_20250617.pdf
 *
 * 使い方:
 *   node scripts/parse-official-circles.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const PDF_URL =
  "https://www.waseda.jp/inst/student/assets/uploads/2025/06/officialcircle_list_20250617.pdf";
const OUTPUT_PATH = path.join(__dirname, "..", "prisma", "official-circles-2025.json");

const ORG_TYPE_PATTERNS = [
  { pattern: /^（１）学生の会/, type: "学生の会" },
  { pattern: /^（2）学生稲門会/, type: "学生稲門会" },
  { pattern: /^（3）同好会/, type: "同好会" },
  { pattern: /^（4）学外/, type: "学外NPO" },
  { pattern: /^（5）学術院承認/, type: "学術院承認" },
];

const SPORTS_KEYWORDS = [
  "ラグビー",
  "サッカー",
  "テニス",
  "野球",
  "バスケ",
  "バレー",
  "柔道",
  "剣道",
  "空手",
  "合気",
  "合氣",
  "スキー",
  "陸上",
  "水泳",
  "スイミング",
  "ボウリング",
  "競技ダンス",
  "ダンス部",
  "トライアスロン",
  "サイクリング",
  "オリエンテーリング",
  "卓球",
  "バドミントン",
  "ゴルフ",
  "ボクシング",
  "ホッケー",
  "クリケット",
  "アルティメット",
  "フットボール",
  "蹴球",
  "漕艇",
  "アーチェリー",
  "トランポリン",
  "ハンドボール",
  "スポーツ",
  "フライング",
  "パラグライダー",
  "クライミング",
  "登山",
  "山岳",
  "釣の会",
  "バーベル",
  "レスリング",
  "フェンシング",
  "F.C.",
  "FC.",
  " F.C",
  "チアダンス",
  "W.L.S.C",
  "WATS",
  "JAWS",
  "J-Birds",
  "J－Ｂｉｒｄｓ",
  "硬式",
  "軟式",
  "庭球",
  "蹴球",
  "American Football",
  "Football",
];

const OTHER_KEYWORDS = [
  "稲門会",
  "国際交流",
  "国際学生",
  "ボランティア",
  "子ども会",
  "NPO",
  "学生会",
  "WHABITAT",
  "アイセック",
  "模擬国連",
];

const CULTURE_KEYWORDS = [
  "研究会",
  "学会",
  "文学会",
  "合唱",
  "管弦",
  "オーケストラ",
  "交響",
  "演劇",
  "映画",
  "美術",
  "書道",
  "茶道",
  "落語",
  "能",
  "狂言",
  "音楽",
  "ジャズ",
  "ギター",
  "マンドリン",
  "吹奏",
  "出版",
  "放送",
  "写真",
  "漫画",
  "アニメ",
  "将棋",
  "囲碁",
  "茶道",
  "陶芸",
  "宝塚",
  "歌舞伎",
  "長唄",
  "三味線",
  "尺八",
  "文学",
  "詩",
  "短歌",
  "マジック",
  "マンガ",
  "法律",
  "法学",
  "経済",
  "政治",
  "哲学",
  "考古",
  "歴史",
  "地理",
  "天文",
  "生物",
  "環境",
  "教育",
  "心理",
  "英語",
  "語",
  "速記",
  "広告",
  "鉄道",
  "旅行",
  "探検",
  "坐禅",
  "済蔭",
  "キリスト",
  "佛教",
  "手話",
  "児童",
  "ミステリ",
  "シナリオ",
  "舞台",
  "アナウンス",
  "マスコミ",
  "新聞",
  "Guardian",
  "ガーディアン",
];

function inferCategory(name, orgType) {
  if (orgType === "学生稲門会" || orgType === "学外NPO") {
    return "その他";
  }

  if (OTHER_KEYWORDS.some((kw) => name.includes(kw))) {
    return "その他";
  }

  if (SPORTS_KEYWORDS.some((kw) => name.includes(kw))) {
    return "体育系";
  }

  if (/(同好会|クラブ|部)$/.test(name) || /(同好会|クラブ|部)[\s　(（]/.test(name)) {
    return "体育系";
  }

  if (CULTURE_KEYWORDS.some((kw) => name.includes(kw))) {
    return "文化系";
  }

  if (orgType === "学術院承認" && /法|学|研|SILS|Law/.test(name)) {
    return "文化系";
  }

  return "文化系";
}

function parseLines(text) {
  const circles = [];
  let orgType = "学生の会";

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const orgMatch = ORG_TYPE_PATTERNS.find(({ pattern }) => pattern.test(line));
    if (orgMatch) {
      orgType = orgMatch.type;
      continue;
    }

    if (
      line.includes("分類番号") ||
      line.includes("公認サークル（全") ||
      line === "2025年度 公認サークル（全477サークル）一覧"
    ) {
      continue;
    }

    const match = line.match(
      /^(?:\d+\s+)?((?:[A-Z]+\d+-\d+|[A-Z]+-\d+))\s+(.+?)\s+(https:\/\/\S+|準備中)\s*$/
    );
    if (!match) continue;

    const [, code, rawName, guide] = match;
    const name = rawName.replace(/\s+/g, " ").trim();
    const category = inferCategory(name, orgType);
    const guideUrl = guide.startsWith("http") ? guide : null;

    circles.push({
      code,
      name,
      category,
      orgType,
      guideUrl,
      description: guideUrl
        ? `早稲田大学2025年度公認サークル（${orgType}）。詳細は公認サークルガイドをご覧ください。`
        : `早稲田大学2025年度公認サークル（${orgType}）。公認サークルガイドは準備中です。`,
    });
  }

  return circles;
}

function downloadText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          downloadText(response.headers.location).then(resolve).catch(reject);
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        response.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  const localTextPath = path.join(__dirname, "..", "data", "official-circle-list-2025.txt");
  let text;

  if (fs.existsSync(localTextPath)) {
    text = fs.readFileSync(localTextPath, "utf8");
    console.log("ローカルのテキストファイルから読み込みます。");
  } else {
    console.log("PDF をダウンロードして解析します...");
    console.log(PDF_URL);
    text = await downloadText(PDF_URL);
  }

  const circles = parseLines(text);
  const nameCounts = circles.reduce((acc, c) => {
    acc[c.name] = (acc[c.name] || 0) + 1;
    return acc;
  }, {});

  for (const circle of circles) {
    if (nameCounts[circle.name] > 1) {
      circle.name = `${circle.name}（${circle.code}）`;
    }
  }

  const uniqueNames = new Set(circles.map((c) => c.name));

  if (circles.length === 0) {
    throw new Error("サークルが1件も解析できませんでした。PDFの形式が変わった可能性があります。");
  }

  if (uniqueNames.size !== circles.length) {
    const dupes = circles.filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) !== i);
    throw new Error(`重複するサークル名があります: ${dupes.map((d) => d.name).join(", ")}`);
  }

  const payload = {
    source: PDF_URL,
    updatedAt: "2025-06-17",
    total: circles.length,
    circles,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const counts = circles.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {}
  );

  console.log(`完了: ${circles.length} 件 → ${OUTPUT_PATH}`);
  console.log("カテゴリ内訳:", counts);
}

main().catch((error) => {
  console.error("FAILED:", error.message);
  process.exit(1);
});
