import { prisma } from "../src/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

async function main() {
  console.log("Start seeding...");

  // Fix Auto Increment Sequences
  try {
    const tables = ["users", "categori_posts", "posts", "comments"];
    for (const table of tables) {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), coalesce(max(id)+1, 1), false) FROM ${table};`
      );
      console.log(`Reset sequence for ${table}`);
    }
  } catch (error) {
    console.warn(
      "Failed to reset sequences, might be permissions or table structure:",
      error
    );
  }

  // 1. Create Users (Admin & User)
  const passwordHash = await bcrypt.hash("string", 10);

  const admin = await prisma.users.upsert({
    where: { email: "a@a.com" },
    update: {},
    create: {
      uuid: uuidv4(),
      name: "Admin User",
      email: "a@a.com",
      password: passwordHash,
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log(`Created admin: ${admin.name}`);

  const user = await prisma.users.upsert({
    where: { email: "u@u.com" },
    update: {},
    create: {
      uuid: uuidv4(),
      name: "Regular User",
      email: "u@u.com",
      password: passwordHash,
      role: "user",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log(`Created user: ${user.name}`);

  const indoCities = [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Yogyakarta",
    "Semarang",
    "Medan",
    "Makassar",
    "Denpasar",
    "Palembang",
    "Bogor",
  ];

  const indoProvinces = [
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Timur",
    "DI Yogyakarta",
    "Jawa Tengah",
    "Sumatera Utara",
    "Sulawesi Selatan",
    "Bali",
    "Sumatera Selatan",
    "Jawa Barat",
  ];

  const maritalStatuses = ["single", "married", "married", "single"];
  const genders = ["male", "female"];

  const sampleProfileCount = 50;

  for (let i = 1; i <= sampleProfileCount; i++) {
    const name = `Orang Indonesia ${i}`;
    const email = `orang${i}@example.id`;
    const username = `orang${i}`;

    const userRecord = await prisma.users.upsert({
      where: { email },
      update: {},
      create: {
        uuid: uuidv4(),
        name,
        email,
        password: passwordHash,
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const city = indoCities[(i - 1) % indoCities.length];
    const province = indoProvinces[(i - 1) % indoProvinces.length];
    const marital_status = maritalStatuses[(i - 1) % maritalStatuses.length];
    const gender = genders[(i - 1) % genders.length];

    const slugBase = slugify(name, { lower: true });
    const slug = `${slugBase}-${i}`;

    const dobYear = 1985 + ((i - 1) % 15);
    const dobMonth = (i - 1) % 12;
    const dobDay = ((i - 1) % 28) + 1;

    const nik = `3174${(100000000000 + i).toString()}`;
    const kk = `3175${(200000000000 + i).toString()}`;
    const phone = `+62812${(10000000 + i).toString().padStart(8, "0")}`;
    const whatsapp = `+62813${(10000000 + i).toString().padStart(8, "0")}`;
    const postal_code = (10000 + i).toString();

    await prisma.profile_users.upsert({
      where: { slug },
      update: {
        user_id: userRecord.id,
      },
      create: {
        uuid: uuidv4(),
        user_id: userRecord.id,
        name,
        slug,
        image: null,
        image_url: null,
        status: "published",
        views: "0",
        tags: "indonesia,profile",
        description: `Profil pengguna Indonesia nomor ${i}`,
        username,
        gender,
        date_of_birth: new Date(dobYear, dobMonth, dobDay),
        marital_status,
        nik,
        kk,
        phone,
        whatsapp,
        address: `Jl. Contoh Nomor ${i}`,
        city,
        state: province,
        country: "Indonesia",
        postal_code,
        website: `https://example.com/orang-${i}`,
        facebook: `https://facebook.com/orang${i}`,
        instagram: `https://instagram.com/orang${i}`,
        twitter: `https://twitter.com/orang${i}`,
        linkedin: `https://linkedin.com/in/orang${i}`,
        youtube: `https://youtube.com/@orang${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
