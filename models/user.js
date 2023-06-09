'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Reply, { foreignKey: 'userId' })
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
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      role: DataTypes.STRING,
      account: DataTypes.STRING,
      background: DataTypes.STRING
    },
    {
      sequelize, // We need to pass the connection instance
      modelName: 'User',
      tableName: 'Users'
    }
  )
  return User
}
