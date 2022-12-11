'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    avatar: {
      type: Sequelize.STRING
    },
    introduction: {
      type: Sequelize.TEXT
    },
    cover: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    // Other model options go here
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  });
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    User.hasMany(models.Like, { foreignKey: 'userId' })
  };
  return User;
};