'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {})
<<<<<<< HEAD
  User.associate = function (models) {
    User.hasMany(models.Like, { foreignKey: 'userId' })
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
=======

  User.associate = function(models) {
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })

>>>>>>> master
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
  User.init({
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.BOOLEAN,
    backgroundImage:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
