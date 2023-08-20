'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    banner: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    tableName: 'Users',
    underscored: true
  })

  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId', as: 'WroteTweet' })

    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweet'
    })

    User.hasMany(models.Reply, { foreignKey: 'UserId' })

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
