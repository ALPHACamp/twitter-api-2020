'use strict';
module.exports = (sequelize, DataTypes) => {
  const OnlineUser = sequelize.define('OnlineUser', {
    UserId: DataTypes.INTEGER
  }, {});
  OnlineUser.associate = function (models) {
    OnlineUser.hasMany(models.User)
  };
  return OnlineUser;
};