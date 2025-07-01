require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function fixOptionsColumn() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // 1. NULL qiymatlarni tozalaymiz
    console.log('🔄 Updating NULL options to []...');
    await sequelize.query(`
      UPDATE "Questions"
      SET "options" = '[]'::jsonb
      WHERE "options" IS NULL;
    `);

    // 2. Ustunni JSONB, NOT NULL va DEFAULT bilan yangilaymiz
    console.log('⚙️  Altering column "options"...');
    await sequelize.query(`
      ALTER TABLE "Questions"
        ALTER COLUMN "options" TYPE JSONB USING "options"::jsonb,
        ALTER COLUMN "options" SET NOT NULL,
        ALTER COLUMN "options" SET DEFAULT '[]'::jsonb;
    `);

    console.log('✅ Column fixed successfully!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

fixOptionsColumn();
