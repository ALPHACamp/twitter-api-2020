'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    totalTweets: DataTypes.INTEGER,
    totalFollowings: DataTypes.INTEGER,
    totalFollowers: DataTypes.INTEGER,
    totalLiked: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'Users'
  });
  User.associate = function(models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId'})
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'TweetsFromLikedUsers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    }),
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  };
  return User;
};