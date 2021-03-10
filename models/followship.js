'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      followerId: {
        type: DataTypes.INTEGER,
      },
      followingId: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Followship',
    }
  );
  Followship.associate = function (models) {};
  return Followship;
};
