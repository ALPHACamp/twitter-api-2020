'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {})
  Followship.associate = function (models) {
    Followship.belongsTo(models.User, {
      foreignKey: 'followingId',
      as: 'followings'
    })
    Followship.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'followers'
    })
    Followship.belongsTo(models.User, {
      foreignKey: 'followingId',
      as: 'userFollowings'
    })
  }
  return Followship;
}
