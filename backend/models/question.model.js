const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
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
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('checkbox', 'number', 'paragraph', 'short_text'),
      allowNull: false,
      defaultValue: 'short_text',
    },
    showInResults: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Templates',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Template, {
      foreignKey: 'templateId',
    });
  };

  // 💡 Hook: type checkbox bo‘lsa, options default Option 1
  Question.beforeCreate((question, options) => {
    if (question.type === 'checkbox' && (!question.options || question.options.length === 0)) {
      question.options = [
        {
          id: uuidv4(),
          text: 'Option 1',
        }
      ];
    }
  });

  Question.beforeUpdate((question, options) => {
    if (question.type === 'checkbox' && (!question.options || question.options.length === 0)) {
      question.options = [
        {
          id: uuidv4(),
          text: 'Option 1',
        }
      ];
    }
  });

  return Question;
};
