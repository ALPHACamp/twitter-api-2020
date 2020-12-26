'use strict';
module.exports = (sequelize, DataTypes) => {
  const Read = sequelize.define('Read', {
    UserId: DataTypes.INTEGER,
    ChannelId: DataTypes.INTEGER,
    date: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Read'
  });
  Read.associate = function (models) {
    Read.belongsTo(models.User)
    Read.belongsTo(models.Channel)
  };
  return Read;
};