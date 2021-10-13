'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatmate = sequelize.define('Chatmate', {
    userAId: DataTypes.INTEGER,
    userBId: DataTypes.INTEGER
  }, {});
  Chatmate.associate = function(models) {
    Chatmate.hasMany(models.ChatRecord, {
      foreignKey: 'roomId',
      as: 'records'
    })
  };
  return Chatmate;
};