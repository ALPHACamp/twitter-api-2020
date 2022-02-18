'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    likedCount: DataTypes.INTEGER,
    repliedCount: DataTypes.INTEGER,
    followingCount: DataTypes.INTEGER,
    followerCount: DataTypes.INTEGER
  }, {
    tableName: 'Users',
  });
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  };
  return User;
};