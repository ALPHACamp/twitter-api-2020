'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['followerId', 'followingId']
        }
      ]
    }
  )
  Followship.associate = function (models) {}

  return Followship
}
