'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })
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
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    banner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  })
  return User;
};