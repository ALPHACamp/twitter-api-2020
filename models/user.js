'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // 和Like的關聯
      User.hasMany(models.Like, { foreignKey: 'UserId' }) 
      // 和Reply的關聯
      User.hasMany(models.Reply, { foreignKey: 'UserId' }) 
      // 和Tweet的關聯
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    introduction: DataTypes.STRING,
    avatar: DataTypes.STRING,
    coverImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
