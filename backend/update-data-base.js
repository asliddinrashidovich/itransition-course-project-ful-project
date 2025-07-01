// scripts/update-constraints.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // 1. Eski constraint'ni olib tashlash
    await sequelize.query(`ALTER TABLE "answers" DROP CONSTRAINT IF EXISTS "Answers_templateId_fkey";`);
    
    // 2. Yangi constraint qo‘shish: ON DELETE CASCADE
    await sequelize.query(`
      ALTER TABLE "answers"
      ADD CONSTRAINT "Answers_templateId_fkey"
      FOREIGN KEY ("templateId") REFERENCES "Templates"("id") ON DELETE CASCADE;
    `);

    // optional: questionId constraint ham yangilash
    await sequelize.query(`ALTER TABLE "answers" DROP CONSTRAINT IF EXISTS "answers_questionId_fkey";`);
    await sequelize.query(`
      ALTER TABLE "answers"
      ADD CONSTRAINT "answers_questionId_fkey"
      FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE;
    `);

    console.log("Foreign key constraints updated with ON DELETE CASCADE.");
    await sequelize.close();
  } catch (err) {
    console.error("Error updating constraints:", err);
  }
};

run();
