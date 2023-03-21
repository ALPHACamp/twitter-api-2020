'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Followship',
      tableName: 'Followships',
      underscored: true,
      timestamps: false
    }
  )
  Followship.associate = function (models) {
  }
  return Followship
}
