'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatship = sequelize.define('Chatship', {
    UserId: DataTypes.INTEGER,
    chatwithId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {});
  Chatship.associate = function (models) {
    // associations can be defined here
    Chatship.belongsTo(models.User)
  };
  return Chatship;
};