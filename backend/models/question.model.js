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
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    get() {
      const raw = this.getDataValue('options');
      const type = this.getDataValue('type');

      if (type === 'checkbox' && (!raw || raw.length === 0)) {
        return ['Option 1'];
      }
        return raw;
      },
    },

    templateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Templates',
        key: 'id',
      },
      onDelete: 'CASCADE', // 🔥 muhim
    },
  });

  // Association (bog‘lanish)
  Question.associate = (models) => {
    Question.belongsTo(models.Template, {
      foreignKey: 'templateId',
    });
  };

  return Question;
};
