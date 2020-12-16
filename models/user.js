'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      account: DataTypes.STRING,
      cover: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  }
  return User
}
