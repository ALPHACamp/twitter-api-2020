'use strict';

const user = require("./user");

module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    followingId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship'
  });
  Followship.associate = function (models) {

  };
  return Followship;
};