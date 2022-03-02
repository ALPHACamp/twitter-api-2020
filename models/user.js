'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    account: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tweetCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }

  }, {
    modelName: 'User',
    tableName: 'Users'

  });
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Reply, { ForeignKey: 'UserId' })
    User.hasMany(models.Like, { ForeignKey: 'UserId' })

    // 自己與跟隨自己的使用者之間關係
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    // 自己與自己跟隨的使用者之間關係
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  };
  return User;
};