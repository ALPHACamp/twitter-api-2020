'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING
    }
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Tweet)
    User.belongsToMany(User, { // self join
      through: models.Followship,
      foreignKey: 'followingId', // who follows me
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId', // who I am following
      as: 'Followings'
    })
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'fromId', 
      as: 'Receivers'
    })
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'toId',
      as: 'Senders'
    })
  }
  return User
}
