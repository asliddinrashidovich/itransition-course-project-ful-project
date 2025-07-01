// scripts/update-constraints.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔗 Connected to DB');

    // 1) TemplateId fkey
    await sequelize.query(`
      ALTER TABLE answers
      DROP CONSTRAINT IF EXISTS "Answers_templateId_fkey",
      ADD CONSTRAINT "Answers_templateId_fkey"
      FOREIGN KEY ("templateId") REFERENCES "Templates"("id") ON DELETE CASCADE;
    `);

    // 2) QuestionId fkey
    await sequelize.query(`
      ALTER TABLE answers
      DROP CONSTRAINT IF EXISTS "answers_questionId_fkey",
      ADD CONSTRAINT "answers_questionId_fkey"
      FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE;
    `);

    console.log('✅ Both answers FKs now ON DELETE CASCADE');
  } catch (err) {
    console.error('❌ Error updating constraints:', err);
  } finally {
    await sequelize.close();
  }
})();
