'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Like, { foreignKey: 'userId' })
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.hasMany(models.Reply, { foreignKey: 'userId' })
  }
  return User
}
