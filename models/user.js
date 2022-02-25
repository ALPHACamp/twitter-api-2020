'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
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
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
  }
  return User
}
