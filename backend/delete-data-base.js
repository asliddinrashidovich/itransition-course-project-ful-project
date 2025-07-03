const { sequelize } = require('./models'); // models/index.js da export qilingan sequelize instance

async function clearAllData() {
  try {
    // foreign key constraints bo'lsa, avval ularni vaqtincha o'chirib turamiz
    await sequelize.query('SET session_replication_role = replica');

    // truncate har bir jadval uchun
    await sequelize.models.Answer.truncate({ cascade: true, restartIdentity: true });
    await sequelize.models.Question.truncate({ cascade: true, restartIdentity: true });
    await sequelize.models.Template.truncate({ cascade: true, restartIdentity: true });
    await sequelize.models.User.truncate({ cascade: true, restartIdentity: true });

    // constraintsni tiklaymiz
    await sequelize.query('SET session_replication_role = DEFAULT');

    console.log('✅ Hamma maʼlumotlar o‘chirildi (table tuzilmalari saqlanib qoldi)');
  } catch (error) {
    console.error('❌ O‘chirishda xatolik:', error);
  } finally {
    await sequelize.close();
  }
}

clearAllData();
