'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', {
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING
  }, {}
  )
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Tweet)
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'RepliedTweets'
    })
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
    User.belongsToMany(User, {
      through: models.Subscript,
      foreignKey: 'authorId',
      as: 'Subscribers'
    })
    User.belongsToMany(User, {
      through: models.Subscript,
      foreignKey: 'subscriberId',
      as: 'Authors'
    })
    User.belongsToMany(User, {
      through: models.Notify,
      foreignKey: 'senderId',
      as: 'receiverId'
    })
    User.belongsToMany(User, {
      through: models.Notify,
      foreignKey: 'receiverId',
      as: 'senderId'
    })
  }
  return User
}
