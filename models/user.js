'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    User.hasMany(models.Like, { foreignKey: 'userId' })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers' // 注意名稱與下面不同
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'// 注意名稱與上面不同
    })
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    banner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
