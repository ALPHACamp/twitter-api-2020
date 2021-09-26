'use strict'
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue(
            'password',
            bcrypt.hashSync(value, bcrypt.genSaltSync(10))
          )
        }
      },
      name: DataTypes.STRING,
      avatar: {
        type: DataTypes.STRING,
        defaultValue: 'https://i.imgur.com/mLoDkSR.png'
      },
      introduction: DataTypes.STRING,
      role: { type: DataTypes.STRING, defaultValue: 'user' },
      account: DataTypes.STRING,
      cover: {
        type: DataTypes.STRING,
        defaultValue: 'https://i.imgur.com/1L2chcu.jpg'
      },
      lastLogin: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Member)
    User.hasMany(models.Message)

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
