import { prisma } from "@/lib/db/prisma";

export async function createFeedback(data) {
  const { name, phone, feedback } = data;

  return await prisma.feedback.create({
    data: {
      name,
      phone,
      feedback,
    },
  });
}

export async function getAllFeedback() {
  return await prisma.feedback.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFeedbackById(id) {
  return await prisma.feedback.findUnique({
    where: { id },
  });
}
