'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notify = sequelize.define('Notify', {
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    objectId: DataTypes.INTEGER,
    objectType: DataTypes.STRING,
    objectText: DataTypes.STRING,
    readStatus: DataTypes.BOOLEAN
  }, {});
  Notify.associate = function (models) {
    Notify.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' })
  };
  return Notify;
};