'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreinerKey: 'followerId',
      as: 'followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreinerKey: 'followingId',
      as: 'followers'
    })
  };
  return User;
};