'use strict'
const Sequelize = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  // sequelize.define(modelName, attributes, options)
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
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
    role: {
      type: Sequelize.STRING
    }, {
      tableName: 'Users',
      timestamps: true,
      freezeTableName: true,
      paranoid: false
    })
  User.associate = function (models) {
  }
  return User
}
