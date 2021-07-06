'use strict';
module.exports = (sequelize, DataTypes) => {
  const PublicMessage = sequelize.define('PublicMessage', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {});
  PublicMessage.associate = function (models) {
    PublicMessage.belongsTo(models.User)
  };
  return PublicMessage;
};