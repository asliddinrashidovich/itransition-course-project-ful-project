require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const addColumnQuery = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='Templates' AND column_name='isPublished'
  ) THEN
    ALTER TABLE "Templates" ADD COLUMN "isPublished" BOOLEAN DEFAULT false;
  END IF;
END$$;
`;

async function runFix() {
  try {
    await client.connect();
    await client.query(addColumnQuery);
    console.log('✅ "isPublished" column added to Templates table!');
  } catch (err) {
    console.error('❌ Error adding isPublished column:', err);
  } finally {
    await client.end();
  }
}

runFix();
