'use strict'
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {})
  Room.associate = function (models) {
    Room.hasMany(models.Chat)
  }
  return Room
}
