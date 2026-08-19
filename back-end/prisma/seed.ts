const { PrismaClient } = require("../generated/prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "School Admin",
      email: "admin@rumbidzai.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const teacherMary = await prisma.user.create({
    data: {
      name: "Teacher Mary",
      email: "mary@rumbidzai.com",
      password: hashedPassword,
      role: "TEACHER",
    },
  });

  const teacherJohn = await prisma.user.create({
    data: {
      name: "Teacher John",
      email: "john@rumbidzai.com",
      password: hashedPassword,
      role: "TEACHER",
    },
  });

  const ecdA = await prisma.class.create({
    data: { name: "ECD A", teacherId: teacherMary.id },
  });

  const ecdB = await prisma.class.create({
    data: { name: "ECD B", teacherId: teacherJohn.id },
  });

  const grade1 = await prisma.class.create({
    data: { name: "Grade 1" }, 
  });

  await prisma.student.createMany({
    data: [
      {
        firstName: "Tendai",
        lastName: "Moyo",
        dateOfBirth: new Date("2021-04-12"),
        gender: "MALE",
        parentName: "John Moyo",
        parentPhone: "0771234567",
        address: "Marondera",
        classId: ecdA.id,
      },
      {
        firstName: "Rudo",
        lastName: "Chirwa",
        dateOfBirth: new Date("2021-06-20"),
        gender: "FEMALE",
        parentName: "Grace Chirwa",
        parentPhone: "0777654321",
        address: "Marondera",
        classId: ecdA.id,
      },
      {
        firstName: "Brian",
        lastName: "Dube",
        dateOfBirth: new Date("2020-02-15"),
        gender: "MALE",
        parentName: "Peter Dube",
        parentPhone: "0712000111",
        address: "Marondera",
        classId: ecdB.id,
      },
    ],
  });

  console.log("✅ Seeding complete!");
  console.log("Credentials:");
  console.log("  Admin: admin@rumbidzai.com / password123");
  console.log("  Teacher Mary (ECD A): mary@rumbidzai.com / password123");
  console.log("  Teacher John (ECD B): john@rumbidzai.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });