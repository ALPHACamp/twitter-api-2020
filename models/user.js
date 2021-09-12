'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Tweet);
    User.hasMany(models.Reply);
    User.hasMany(models.Like);

    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followingId",
      as: "Followers",
    });

    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followerId",
      as: "Followings",
    });
  };
  return User;
};