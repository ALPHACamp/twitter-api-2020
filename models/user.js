'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'following',
      as: 'Followers'
    })
    User.hasMany(models.Like, { foreignKey: 'userId' })
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover_image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
