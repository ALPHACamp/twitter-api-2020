'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {});
  Followship.associate = function (models) {
  };
  return Followship;
};