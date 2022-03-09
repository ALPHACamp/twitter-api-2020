'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      Member.belongsTo(models.User)
      Member.belongsTo(models.Room)
    }
  }
  Member.init(
    {
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Member'
    }
  )
  return Member
}
