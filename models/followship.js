'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Followship.associate = function (models) {
    // associations can be defined here
  };
  return Followship;
};