'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Followships',
    modelName:'Followship'
  })
  Followship.associate = function(models) {
    Followship.belongsTo(models.User, { foreignKey: "followingId", as: "following" })
    Followship.belongsTo(models.User, { foreignKey: "followerId", as: "follower" })
  }
  return Followship
}