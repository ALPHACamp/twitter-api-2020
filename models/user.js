module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    // User.belongsToMany(models.Tweet, {
    //   through: models.Like,
    //   foreignKey: 'userId',
    //   as: 'LikedTweets'
    // })
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
  User.init({
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
