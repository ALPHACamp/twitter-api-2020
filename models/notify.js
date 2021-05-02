'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notify = sequelize.define('Notify', {
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    objectId: DataTypes.INTEGER,
    objectType: DataTypes.STRING,
    ObjectText: DataTypes.STRING,
    readStatus: DataTypes.BOOLEAN
  }, {});
  Notify.associate = function (models) {
  };
  return Notify;
};