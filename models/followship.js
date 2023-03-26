'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {}, {})
  Followship.associate = function (models) {
    Followship.belongsTo(models.User, { foreignKey: 'followerId', as: 'followerUser' })
    Followship.belongsTo(models.User, { foreignKey: 'followingId', as: 'followingUser' })
  }
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  })
  return Followship
}
