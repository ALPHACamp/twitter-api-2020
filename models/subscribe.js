'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscribe = sequelize.define('Subscribe', {
    subscribing: DataTypes.INTEGER,
    subscriber: DataTypes.INTEGER
  }, {});
  Subscribe.associate = function(models) {
    // associations can be defined here
  };
  return Subscribe;
};