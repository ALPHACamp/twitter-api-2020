'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // define association here
      // 一對多關聯
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })

      // 追隨關聯
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
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })

  return User
}
