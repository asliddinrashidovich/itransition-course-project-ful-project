const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance
const Template = require('./template.model'); // TO‘G‘RI yo‘l bo‘lishi shart!

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Untitled Question',
  },
  description: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.ENUM('checkbox', 'number', 'paragraph', 'short_text'),
    allowNull: false,
    defaultValue: 'short_text',
  },
  showInResults: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// MUHIM! Template bu yerda Model bo‘lishi kerak
Question.belongsTo(Template, { foreignKey: 'templateId' });
Template.hasMany(Question, { foreignKey: 'templateId', as: 'questions' });

module.exports = Question;
