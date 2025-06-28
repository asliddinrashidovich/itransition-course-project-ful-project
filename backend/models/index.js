const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Modellarni yuklash
db.User = require('./user.model')(sequelize, DataTypes);
db.Template = require('./template.model')(sequelize, DataTypes);
db.Question = require('./question.model')(sequelize, DataTypes);
db.Answer = require('./answer.model')(sequelize, DataTypes);

// 💡 Assotsiatsiyalar
db.Template.belongsTo(db.User, { foreignKey: 'authorId', as: 'author' });
db.User.hasMany(db.Template, { foreignKey: 'authorId', as: 'templates' });

db.Question.belongsTo(db.Template, { foreignKey: 'templateId' });
db.Template.hasMany(db.Question, { foreignKey: 'templateId', as: 'questions' });

db.Answer.belongsTo(db.Template, { foreignKey: 'templateId' });
db.Answer.belongsTo(db.Question, { foreignKey: 'questionId' });

module.exports = db;
