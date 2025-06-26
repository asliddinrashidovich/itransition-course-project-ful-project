const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user.model');

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
  description: {
    type: DataTypes.TEXT,
  },
  topic: {
    type: DataTypes.STRING,
    defaultValue: 'Other',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
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
  }
});

Template.belongsTo(User, { foreignKey: 'authorId' });
User.hasMany(Template, { foreignKey: 'authorId' });

module.exports = Template;
