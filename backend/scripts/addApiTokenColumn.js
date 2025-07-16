require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Render.com uchun kerak
    }
  }
});

async function addApiTokenColumn() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const [results] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'Users' AND column_name = 'api_token'
    `);

    if (results.length > 0) {
      console.log('❗️"api_token" column already exists in "Users" table.');
    } else {
      await sequelize.query(`
        ALTER TABLE "Users"
        ADD COLUMN "api_token" VARCHAR UNIQUE
      `);
      console.log('✅ "api_token" column added to "Users" table.');
    }
  } catch (err) {
    console.error('❌ Error altering table:', err.message);
  } finally {
    await sequelize.close();
  }
}

addApiTokenColumn();
