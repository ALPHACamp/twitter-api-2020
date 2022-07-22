'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
  }
  return User
}
