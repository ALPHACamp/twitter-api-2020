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
  }, {})
  Followship.associate = function (models) {
    Followship.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'Followers'
    })

    Followship.belongsTo(models.User, {
      foreignKey: 'followingId',
      as: 'Followings'
    })
  }
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
