'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
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
  return User;
};