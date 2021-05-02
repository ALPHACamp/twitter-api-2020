'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      avatar: DataTypes.STRING,
      introduction: DataTypes.STRING,
      account: DataTypes.STRING,
      cover: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.hasMany(models.JoinRoom)
    User.hasMany(models.Message)
    User.hasMany(models.Notification)
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
      through: models.Subscription,
      foreignKey: 'subscriberId',
      as: 'Subscriptions'
    })
    User.belongsToMany(User, {
      through: models.Subscription,
      foreignKey: 'authorId',
      as: 'Subscribers'
    })

    User.belongsToMany(models.ChatRoom, {
      through: models.JoinRoom,
      foreignKey: 'UserId',
      as: 'JoinedRooms'
    })
  }
  return User
}
