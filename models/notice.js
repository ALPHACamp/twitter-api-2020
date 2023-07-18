'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    static associate (models) {
      Notice.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Notice.init(
    {
      userId: DataTypes.INTEGER,
      newNotice: DataTypes.DATE,
      noticeRead: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Notice',
      tableName: 'Notices'
    }
  )
  return Notice
}
