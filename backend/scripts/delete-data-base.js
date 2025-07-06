const { sequelize } = require('../models');

async function clearAllData() {
  try {
    await sequelize.query('SET session_replication_role = replica');
    await sequelize.models.Answer.truncate({ cascade: true, restartIdentity: true });
    await sequelize.models.Question.truncate({ cascade: true, restartIdentity: true });
    await sequelize.models.Template.truncate({ cascade: true, restartIdentity: true });
    await sequelize.models.User.truncate({ cascade: true, restartIdentity: true });
    await sequelize.query('SET session_replication_role = DEFAULT');
    console.log('Success');
  } catch (error) {
    console.error('Error when deleting:', error);
  } finally {
    await sequelize.close();
  }
}

clearAllData();
