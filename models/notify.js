'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notify = sequelize.define('Notify', {
    targetId: DataTypes.INTEGER,
    noticeId: DataTypes.INTEGER,
    noticeType: DataTypes.STRING,
    readStatus: DataTypes.BOOLEAN
  }, {});
  Notify.associate = function (models) {
    // associations can be defined here
    Notify.belongsTo(models.User)
  };
  return Notify;
};