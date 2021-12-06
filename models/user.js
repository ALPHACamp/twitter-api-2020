'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      introduction: DataTypes.STRING,
      role: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
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
      through: models.Notice,
      foreignKey: 'noticingId',
      as: 'Noticers'
    })
    User.belongsToMany(User, {
      through: models.Notice,
      foreignKey: 'noticerId',
      as: 'Noticings'
    })
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
  }
  return User
}
