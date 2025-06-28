module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Question', {
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
  });
};
