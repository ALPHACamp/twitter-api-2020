'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notify = sequelize.define('Notify', {
    notiSbj: DataTypes.INTEGER,
    notiObj: DataTypes.INTEGER
  }, {});
  Notify.associate = function(models) {
    // associations can be defined here
  };
  return Notify;
};