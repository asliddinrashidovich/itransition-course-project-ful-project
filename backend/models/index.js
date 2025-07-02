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
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.TemplateLike = require('./templateLikes.model')(sequelize, DataTypes);

// ✅ Assotsiatsiyalarni chaqirish
if (db.Answer.associate) db.Answer.associate(db);
if (db.Question.associate) db.Question.associate(db);
if (db.Template.associate) db.Template.associate(db);
if (db.User.associate) db.User.associate(db);
if (db.Comment.associate) db.Comment.associate(db);
if (db.TemplateLike.associate) db.TemplateLike.associate(db)


module.exports = db;
