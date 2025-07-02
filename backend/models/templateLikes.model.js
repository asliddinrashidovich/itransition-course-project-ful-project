module.exports = (sequelize, DataTypes) => {
  const TemplateLike = sequelize.define('TemplateLike', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'templateId']
      }
    ]
  });

  return TemplateLike;
};
