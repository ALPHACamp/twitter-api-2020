'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatpublic = sequelize.define('Chatpublic', {
    UserId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  Chatpublic.associate = function (models) {
    Chatpublic.belongsTo(models.User)
  };
  return Chatpublic;
};