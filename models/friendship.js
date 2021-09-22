'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friendship = sequelize.define('Friendship', {
    adder: DataTypes.INTEGER,
    added: DataTypes.INTEGER
  }, {});
  Friendship.associate = function(models) {
    // associations can be defined here
  };
  return Friendship;
};