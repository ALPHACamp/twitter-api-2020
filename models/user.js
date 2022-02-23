'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING(50),
    account: DataTypes.STRING(15),
    cover: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING,
    introduction: DataTypes.TEXT(160)
  }, {
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.hasMany(models.Like, { foreignKey: 'userId' })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  }
  return User
}
