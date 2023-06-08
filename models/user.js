'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Tweet, { foreignKey: 'userId' })
    User.hasMany(models.Reply, { foreignKey: 'userId' })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'userId',
      as: 'LikedTweets'
    })
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
  };
  User.init({
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  })
  return User;
};