'use strict'
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId: {
      type: DataTypes.INTEGER
    },
    followingId: {
      type: DataTypes.INTEGER
    }
  }, {})
  Followship.associate = function (models) {
    //associate User pk with foreign key followerId (since as 'follower')
    Followship.belongsTo(models.User, { as: 'follower' })
    //associate User pk with foreign key followerId (since as 'following')
    Followship.belongsTo(models.User, { as: 'following' })
  }
  return Followship
}
