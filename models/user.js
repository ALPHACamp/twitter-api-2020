'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId', as: 'WrittenTweet' })

    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweet'
    })

    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })

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

  User.init({
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown' // 不加defaultValue測試不會過
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    banner: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: false // 和之前的教案不同，此次不使用underscored，如createdAt
  })

  return User
}
