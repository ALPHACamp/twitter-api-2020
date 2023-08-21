'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Read extends Model {
    static associate(models) {
      Read.belongsTo(models.User, { foreignKey: 'userId' })
      Read.belongsTo(models.Room, { foreignKey: 'roomId' })
    }
  }
  Read.init(
    {
      userId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      lastRead: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Read',
      tableName: 'Reads'
    }
  )
  return Read
}
