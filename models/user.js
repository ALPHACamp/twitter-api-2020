'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      account: DataTypes.STRING,
      cover: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      role: DataTypes.STRING,
      likedCount: DataTypes.INTEGER,
      repliedCount: DataTypes.INTEGER,
      followingCount: DataTypes.INTEGER,
      followerCount: DataTypes.INTEGER
    },
    {
      tableName: 'Users'
    }
  )
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.hasMany(models.Notification, {
      foreignKey: 'UserId'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Subscription,
      foreignKey: 'subscriberId',
      as: 'Subscribings'
    })
    User.belongsToMany(User, {
      through: models.Subscription,
      foreignKey: 'subscribingId',
      as: 'Subscribers'
    })
  }
  return User
}
