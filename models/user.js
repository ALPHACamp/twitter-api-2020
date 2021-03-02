<<<<<<< HEAD
'use strict'
=======
'use strict';
>>>>>>> b6cdbe55117f2074cca54fd76d2f33e5cec6a5be
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
<<<<<<< HEAD
    cover: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User'
  })
  User.associate = function (models) {

    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)

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
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'ReplyTweets'
    })
  }
  return User
}
=======
    role: DataTypes.STRING,

  }, {});
  User.associate = function (models) {
  };
  return User;
};
>>>>>>> b6cdbe55117f2074cca54fd76d2f33e5cec6a5be
