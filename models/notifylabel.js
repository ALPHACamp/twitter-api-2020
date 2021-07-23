'use strict'
module.exports = (sequelize, DataTypes) => {
  const NotifyLabel = sequelize.define('NotifyLabel', {
    labelName: DataTypes.STRING,
    title: DataTypes.STRING
  }, {})
  NotifyLabel.associate = function (models) {
    // associations can be defined here
  }
  return NotifyLabel
}
