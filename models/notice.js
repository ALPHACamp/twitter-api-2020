'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define('Notice', {
    noticerId: DataTypes.INTEGER,
    noticingId: DataTypes.INTEGER
  }, {});
  Notice.associate = function(models) {
    // associations can be defined here
  };
  return Notice;
};