require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// SQL query
const fixSchemaQuery = `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_questions_type') THEN
    CREATE TYPE "enum_questions_type" AS ENUM ('checkbox', 'number', 'paragraph', 'short_text');
  END IF;
END $$;

ALTER TABLE "Questions" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Questions" ALTER COLUMN "type" TYPE "enum_questions_type" USING "type"::text::"enum_questions_type";
ALTER TABLE "Questions" ALTER COLUMN "type" SET DEFAULT 'short_text';

ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "isBlocked" BOOLEAN DEFAULT false;
`;

async function run() {
  try {
    await client.connect();
    await client.query(fixSchemaQuery);
    console.log("✅ Schema updated successfully.");
  } catch (err) {
    console.error("❌ Error while updating schema:", err.message);
  } finally {
    await client.end();
  }
}

run();
