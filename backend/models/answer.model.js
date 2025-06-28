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
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responderEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'answers',
  timestamps: true,
});
Answer.belongsTo(Template, { foreignKey: 'templateId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

module.exports = Answer;
