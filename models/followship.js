'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
  }, {});
  Followship.associate = function (models) {
  };
  return Followship;
};