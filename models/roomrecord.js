'use strict'
module.exports = (sequelize, DataTypes) => {
  const RoomRecord = sequelize.define('RoomRecord', {
    RoomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {})
  RoomRecord.associate = function (models) { }
  return RoomRecord
}
