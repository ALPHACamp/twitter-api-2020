'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // Relation(s)
      User.hasMany(models.Reply, { foreignKey: 'userId' })
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Like, { foreignKey: 'userId' })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init({
    // field: DataTypes.TYPE
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
