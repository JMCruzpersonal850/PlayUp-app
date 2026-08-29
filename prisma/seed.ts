import path from "node:path";
import { config } from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

config();

function getDatabaseUrl() {
  const configured = process.env.DATABASE_URL ?? "file:./dev.db";
  if (!configured.startsWith("file:")) {
    return configured;
  }

  const filePath = configured.replace(/^file:/, "");
  if (path.isAbsolute(filePath)) {
    return configured;
  }

  return `file:${path.join(process.cwd(), filePath)}`;
}

const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.gameParticipant.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 10);

  const [alex, jordan, sam] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@playup.dev",
        passwordHash,
        location: "Pensacola, FL",
        bio: "Weekend hoop runner at Bayview Park.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jordan Lee",
        email: "jordan@playup.dev",
        passwordHash,
        location: "Pensacola, FL",
        bio: "Soccer captain looking for consistent Sunday runs.",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sam Patel",
        email: "sam@playup.dev",
        passwordHash,
        location: "Pensacola, FL",
        bio: "Tennis doubles enthusiast.",
      },
    }),
  ]);

  const now = new Date();

  const basketball = await prisma.game.create({
    data: {
      title: "Sunset 5v5 at Bayview",
      description: "Full court run. Bring both a light and dark jersey.",
      sport: "Basketball",
      location: "Pensacola, FL",
      address: "Bayview Park, 2001 E Lloyd St, Pensacola, FL 32503",
      parkId: "bayview-park",
      parkName: "Bayview Park",
      latitude: 30.432782,
      longitude: -87.190504,
      dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 30),
      maxPlayers: 10,
      skillLevel: "Intermediate",
      hostId: alex.id,
      participants: {
        create: [
          { userId: alex.id, status: "JOINED" },
          { userId: jordan.id, status: "JOINED" },
        ],
      },
    },
  });

  const soccer = await prisma.game.create({
    data: {
      title: "Sunday Morning 7v7 Soccer",
      description: "Friendly run. Cleats recommended, no slide tackles.",
      sport: "Soccer",
      location: "Pensacola, FL",
      address: "Roger Scott Athletic Complex, Pensacola, FL",
      parkId: "roger-scott-athletic-complex",
      parkName: "Roger Scott Athletic Complex",
      latitude: 30.4673,
      longitude: -87.19722,
      dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 9, 0),
      maxPlayers: 14,
      skillLevel: "All levels",
      hostId: jordan.id,
      participants: {
        create: [
          { userId: jordan.id, status: "JOINED" },
          { userId: sam.id, status: "JOINED" },
        ],
      },
    },
  });

  const tennis = await prisma.game.create({
    data: {
      title: "Doubles Tennis at Seville Square",
      description: "Need one more for rotating doubles sets.",
      sport: "Tennis",
      location: "Pensacola, FL",
      address: "Seville Square, Pensacola, FL",
      parkId: "seville-square",
      parkName: "Seville Square",
      latitude: 30.409579,
      longitude: -87.209837,
      dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0),
      maxPlayers: 4,
      skillLevel: "Advanced",
      hostId: sam.id,
      participants: {
        create: [{ userId: sam.id, status: "JOINED" }],
      },
    },
  });

  const pickleball = await prisma.game.create({
    data: {
      title: "After-work Pickleball Mixer",
      description: "All equipment provided. Great for first-timers.",
      sport: "Pickleball",
      location: "Pensacola, FL",
      address: "Community Maritime Park, Pensacola, FL",
      parkId: "community-maritime-park",
      parkName: "Community Maritime Park",
      latitude: 30.403879,
      longitude: -87.218914,
      dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 19, 0),
      maxPlayers: 8,
      skillLevel: "Beginner",
      hostId: alex.id,
      participants: {
        create: [{ userId: alex.id, status: "JOINED" }],
      },
    },
  });

  console.log("Seeded demo users and games:");
  console.log("- alex@playup.dev / password123");
  console.log("- jordan@playup.dev / password123");
  console.log("- sam@playup.dev / password123");
  console.log(`- ${basketball.title}`);
  console.log(`- ${soccer.title}`);
  console.log(`- ${tennis.title}`);
  console.log(`- ${pickleball.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
