module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define('Template', {
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
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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

  Template.associate = (models) => {
    Template.belongsTo(models.User, {foreignKey: 'authorId', as: 'author', onDelete: 'SET NULL'});
    Template.hasMany(models.Question, { as: 'questions', foreignKey: 'templateId', onDelete: 'CASCADE', hooks: true});
    Template.hasMany(models.Answer, {foreignKey: 'templateId', onDelete: 'CASCADE', hooks: true});
  };

  return Template;
};
