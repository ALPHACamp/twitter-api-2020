'use strict';
module.exports = (sequelize, DataTypes) => {
  const Userlist = sequelize.define('Userlist', {
    UserId: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    userAccount: DataTypes.STRING,
    userAvatar: DataTypes.STRING,
  }, {});
  Userlist.associate = function (models) {
    // associations can be defined here
    Userlist.belongsTo(models.User)
  };
  return Userlist;
};