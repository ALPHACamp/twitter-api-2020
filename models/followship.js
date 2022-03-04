'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    modelName: 'Followship',
    tableName: 'Followships'
  })
  Followship.associate = function (models) {
    // associations can be defined here
  }
  return Followship
}
