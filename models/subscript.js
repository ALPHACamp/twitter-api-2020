'use strict'
module.exports = (sequelize, DataTypes) => {
  const Subscript = sequelize.define(
    'Subscript',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subscriberId: DataTypes.INTEGER,
      authorId: DataTypes.INTEGER
    },
    {}
  )
  Subscript.associate = function (models) { }
  return Subscript
}