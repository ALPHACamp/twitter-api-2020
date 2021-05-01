'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://via.placeholder.com/250'
    },
    introduction: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    account: {
      type: DataTypes.STRING,
      unique: true
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue: 'https://via.placeholder.com/250'
    }
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Chat)
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
  }
  return User
}
