'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING
    }
  }, {
    modelName: 'User',
    tableName: 'Users'
  });
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Reply, { ForeignKey: 'UserId' })
  };
  return User;
};