'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {});
  Followship.associate = function (models) {
  };
  return Followship;
};