// models/answer.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Template = require('./template.model');
const Question = require('./question.model');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  templateId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT, // checkboxda array bo‘lsa, JSON formatda kiritish mumkin
  },
  responderEmail: {
    type: DataTypes.STRING, // optional: foydalanuvchi kim ekanligini bilish uchun
  }
});

Answer.belongsTo(Template, { foreignKey: 'templateId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

module.exports = Answer;
