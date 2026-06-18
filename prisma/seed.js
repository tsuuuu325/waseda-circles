const { PrismaClient } = require("@prisma/client");

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "";

  if (url.startsWith("libsql://")) {
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

const circles = [
  {
    name: "早稲田ラグビー部",
    category: "体育系",
    description: "日本屈指の強豪。練習はハードだが仲が良い。",
  },
  {
    name: "早稲田オーケストラ",
    category: "文化系",
    description: "音楽が好きな人向け。初心者も歓迎。",
  },
  {
    name: "早稲田放送研究会",
    category: "文化系",
    description: "ラジオ制作やイベント運営をしている。",
  },
  {
    name: "早稲田テニスサークル",
    category: "体育系",
    description: "週2回の練習。レベル別に分かれている。",
  },
  {
    name: "早稲田国際交流サークル",
    category: "その他",
    description: "留学生との交流イベントが多い。",
  },
];

const reviews = [
  {
    circleIndex: 0,
    rating: 5,
    text: "練習はきついけど、チームの一体感がすごい。一生の仲間ができます。",
    createdAt: new Date("2025-11-20"),
  },
  {
    circleIndex: 0,
    rating: 4,
    text: "初心者は厳しい面もあるけど、本気でラグビーしたい人には最高。",
    createdAt: new Date("2025-10-05"),
  },
  {
    circleIndex: 1,
    rating: 5,
    text: "楽器未経験でも入れました。先輩が丁寧に教えてくれます。",
    createdAt: new Date("2025-09-15"),
  },
  {
    circleIndex: 1,
    rating: 4,
    text: "定期演奏会が楽しみ。練習量は多めです。",
    createdAt: new Date("2025-08-22"),
  },
  {
    circleIndex: 2,
    rating: 4,
    text: "ラジオの収録体験ができて面白い。機材いじりが好きな人向け。",
    createdAt: new Date("2025-07-10"),
  },
  {
    circleIndex: 3,
    rating: 4,
    text: "レベル別に分かれるので自分のペースで続けやすい。",
    createdAt: new Date("2025-06-18"),
  },
  {
    circleIndex: 4,
    rating: 5,
    text: "留学生の友達がたくさんできた。英語が伸びた。",
    createdAt: new Date("2025-05-30"),
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.circle.deleteMany();

  const createdCircles = [];

  for (const circle of circles) {
    createdCircles.push(await prisma.circle.create({ data: circle }));
  }

  for (const review of reviews) {
    await prisma.review.create({
      data: {
        circleId: createdCircles[review.circleIndex].id,
        rating: review.rating,
        text: review.text,
        createdAt: review.createdAt,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
