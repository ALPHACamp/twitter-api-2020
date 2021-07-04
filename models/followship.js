'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {})
  Followship.associate = function (models) {
  }
  return Followship
}
