'use strict'
module.exports = (sequelize, DataTypes) => {
  const NotifyLabel = sequelize.define('NotifyLabel', {
    labelName: DataTypes.STRING,
    title: DataTypes.STRING
  }, {})
  NotifyLabel.associate = function (models) {
    NotifyLabel.hasMany(models.Notification)
  }
  return NotifyLabel
}
