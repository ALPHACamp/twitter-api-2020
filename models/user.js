'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.STRING,
      role: DataTypes.STRING,
      cover: DataTypes.STRING,
      account: DataTypes.STRING,
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet) //{ onDelete: 'cascade', hooks: true }
    User.hasMany(models.Like)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers',
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings',
    })
  }
  return User
}
