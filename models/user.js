'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    banner: DataTypes.STRING
  }, {
    modelName: 'User',
    tableName: 'Users', 
  });
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.belongsToMany(models.Tweet,{
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikeTweets'
    })
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.belongsToMany(User, { // 我追蹤的人
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(User, { // 粉絲
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  };
  return User;
};