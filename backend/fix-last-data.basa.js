require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = `
-- 1. DROP DEFAULT so ENUM o‘zgarishi mumkin bo‘lsin
ALTER TABLE "Questions" ALTER COLUMN "type" DROP DEFAULT;

-- 2. Ustunni vaqtinchalik TEXT ga o‘tkazamiz
ALTER TABLE "Questions" ALTER COLUMN "type" TYPE TEXT;

-- 3. Eski ENUM turini o‘chirib tashlaymiz
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_questions_type') THEN
    DROP TYPE enum_questions_type;
  END IF;
END$$;

-- 4. Yangi ENUM turini yaratamiz (katta harflarda, Sequelize odatiga mos)
DO $$
BEGIN
  CREATE TYPE "enum_Questions_type" AS ENUM ('checkbox', 'number', 'paragraph', 'short_text');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

-- 5. Ustunni yangi enum turiga o‘tkazamiz
ALTER TABLE "Questions" ALTER COLUMN "type" TYPE "enum_Questions_type" USING "type"::"enum_Questions_type";

-- 6. Default qiymat va NOT NULL qayta tiklanadi
ALTER TABLE "Questions" ALTER COLUMN "type" SET DEFAULT 'short_text';
ALTER TABLE "Questions" ALTER COLUMN "type" SET NOT NULL;
`;

async function runFix() {
  try {
    await client.connect();
    await client.query(query);
    console.log("✅ ENUM turi muvaffaqiyatli yangilandi");
  } catch (err) {
    console.error("❌ Xatolik yuz berdi:", err);
  } finally {
    await client.end();
  }
}

runFix();
