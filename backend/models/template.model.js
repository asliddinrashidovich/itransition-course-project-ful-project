module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Template', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Untitled form',
    },
    description: DataTypes.TEXT,
    topic: {
      type: DataTypes.STRING,
      defaultValue: 'Other',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    imageUrl: DataTypes.STRING,
    access: {
      type: DataTypes.ENUM('public', 'restricted'),
      defaultValue: 'public',
    },
    allowedUsers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
