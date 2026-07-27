import { hash } from "bcryptjs";
import { prisma } from "../../src/lib/prisma";

export async function UsersSeeder() {
  await prisma.user.upsert({
    where: { email: "adminjellygateway@gmail.com" },
    update: {},
    create: {
      username: "admin",
      email: "adminjellygateway@gmail.com",
      passwordHash: await hash("123456", 6),
      status: "PENDING",
      role: "ADMIN",
    },
  });

  // more creating below
}

UsersSeeder()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
