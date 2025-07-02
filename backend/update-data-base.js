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

async function addLikesColumnToTemplates() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // likes ustuni mavjudligini tekshiramiz
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Templates' AND column_name = 'likes';
    `);

    if (results.length === 0) {
      console.log('➕ Adding "likes" column to Templates...');
      await sequelize.query(`
        ALTER TABLE "Templates"
        ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
      `);
      console.log('✅ "likes" column added to Templates successfully!');
    } else {
      console.log('ℹ️ "likes" column already exists in Templates. Nothing to change.');
    }

    await sequelize.close();
  } catch (err) {
    console.error('❌ Error while updating DB:', err.message);
  }
}

addLikesColumnToTemplates();
