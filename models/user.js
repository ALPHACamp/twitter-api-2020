'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING,
    avatar: { type: DataTypes.STRING, defaultValue: 'https://image.flaticon.com/icons/png/512/149/149071.png' },
    introduction: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' },
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(models.Room, {
      through: models.RoomUser,
      foreignKey: 'UserId',
      as: 'UserInRooms'
    })
    // 如果定義以下關係，則notification無法正常關聯到subscribeship,可能要改成belongsTo，並到Notification去定義
    // User.belongsToMany(models.User, {
    //   through: models.Subscribeship,
    //   foreignKey: 'subscriberId',
    //   as: 'Subscribings'
    // })
    // User.belongsToMany(models.User, {
    //   through: models.Subscribeship,
    //   foreignKey: 'subscribingId',
    //   as: 'Subscribers'
    // })
  };
  return User;
};