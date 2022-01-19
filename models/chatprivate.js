'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatprivate = sequelize.define('Chatprivate', {
    ChannelId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chatprivate'
  });
  Chatprivate.associate = function (models) {
    Chatprivate.belongsTo(models.User)
    Chatprivate.belongsTo(models.Channel)
  };
  return Chatprivate;
};