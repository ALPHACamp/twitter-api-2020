'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatmessage = sequelize.define('Chatmessage', {
    UserId: DataTypes.INTEGER,
    text: DataTypes.STRING,
  }, {});
  Chatmessage.associate = function (models) {
    Chatmessage.belongsTo(models.User)
  };
  return Chatmessage;
};