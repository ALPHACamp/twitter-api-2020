'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    tableName: 'Followships',
    underscored: true
  });
  Followship.associate = function(models) {
  };
  return Followship;
};