module.exports = (sequelize, DataTypes) => {
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

  // ✅ Bu juda muhim!
  Answer.associate = (models) => {
    Answer.belongsTo(models.Template, {
      foreignKey: 'templateId',
      onDelete: 'CASCADE',
    });

    Answer.belongsTo(models.Question, {
      foreignKey: 'questionId',
      onDelete: 'CASCADE',
    });
  };

  return Answer;
};
