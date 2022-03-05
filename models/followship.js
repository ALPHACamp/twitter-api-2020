'use strict';
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
    },
  }, {});
  Followship.associate = function (models) {
    Followship.belongsTo(models.User, {
      foreignKey: 'followingId',
      as: 'Following'
    })
    Followship.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'Follower'
    })
  };
  return Followship;
};