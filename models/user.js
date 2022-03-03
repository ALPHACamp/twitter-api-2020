'use strict'
const COVER_DEFAULT = 'https://i.imgur.com/dfpDjBN.jpg'
const AVATAR_DEFAULT = 'https://i.imgur.com/zYddUs8.png'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: {
      type: DataTypes.STRING,
      defaultValue: COVER_DEFAULT
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: AVATAR_DEFAULT
    },
    role: DataTypes.STRING,
    introduction: DataTypes.TEXT
  }, {
    modelName: 'User',
    tableName: 'Users'
  })
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
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
  return User
}
