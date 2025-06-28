module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Answer', {
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
};
