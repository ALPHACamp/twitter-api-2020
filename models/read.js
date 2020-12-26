'use strict';
module.exports = (sequelize, DataTypes) => {
  const Read = sequelize.define('Read', {
    UserId: DataTypes.INTEGER,
    ChannelId: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Read',
    timestamps: false
  });
  Read.associate = function (models) {
    Read.belongsTo(models.User)
    Read.belongsTo(models.Channel)
  };
  return Read;
};