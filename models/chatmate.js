'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatmate = sequelize.define('Chatmate', {
    userAId: DataTypes.INTEGER,
    userBId: DataTypes.INTEGER
  }, {});
  Chatmate.associate = function(models) {
    // associations can be defined here
  };
  return Chatmate;
};