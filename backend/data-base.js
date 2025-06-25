require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const fixEnumQuery = `
DO $$
BEGIN
  CREATE TYPE "enum_Questions_type" AS ENUM ('checkbox', 'number', 'paragraph', 'short_text');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

ALTER TABLE "Questions" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Questions" ALTER COLUMN "type" TYPE "enum_Questions_type" USING "type"::"enum_Questions_type";
ALTER TABLE "Questions" ALTER COLUMN "type" SET DEFAULT 'short_text';
`;

async function runFix() {
  try {
    await client.connect();
    await client.query(fixEnumQuery);
    console.log('✅ ENUM type created and column converted successfully!');
  } catch (err) {
    console.error('❌ Error running fixEnumQuery:', err);
  } finally {
    await client.end();
  }
}

runFix();
