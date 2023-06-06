'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {}, {})
  User.associate = function (models) {
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
