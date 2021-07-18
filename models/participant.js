'use strict'
module.exports = (sequelize, DataTypes) => {
  const Participant = sequelize.define(
    'Participant',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER
    },
    {}
  )
  Participant.associate = function (models) {
    participant.belongsTo(models.User)
    participant.belongsTo(models.Room)
  }
  return Participant
}
