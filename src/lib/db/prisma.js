import { PrismaClient } from "@prisma/client";

// Create a singleton Prisma instance
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Ensure we don't create multiple instances in development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
