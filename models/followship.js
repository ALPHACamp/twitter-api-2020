'use strict';

const user = require("./user");

module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followingId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship'
  });
  Followship.associate = function (models) {
    // Followship.belongsTo(models.User, { as: 'Follower', foreignKey: 'followingId' })
  };
  return Followship;
};