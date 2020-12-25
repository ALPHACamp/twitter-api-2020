'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    UserOne: DataTypes.INTEGER,
    UserTwo: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Channel'
  });
  Channel.associate = function (models) {
    Channel.hasMany(models.Chatprivate)
    Channel.belongsTo(models.User)
  };
  return Channel;
};