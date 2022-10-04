'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followerId: {
      type: DataTypes.INTEGER
    },
    followingId: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Followships',
    timestamps: true,
    paranoid: false,
    underscored: true
  })
  Followship.associate = function (models) {
  }
  return Followship
}
