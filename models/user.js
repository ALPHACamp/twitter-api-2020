'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Reply, { foreignKey: 'userId' })
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Like, { foreignKey: 'userId' })
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
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://joeschmoe.io/api/v1/random'
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://github.com/ritachien/twitter-api-2022/blob/main/assets/default-cover.png?raw=true'
    },
    introduction: DataTypes.TEXT,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
