'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Reply, { foreignKey: 'userId' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedTweets'
      })
    }
  };
  User.init({
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    introduction: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
