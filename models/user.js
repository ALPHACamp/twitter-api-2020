'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    account: {
      type: DataTypes.STRING,
      unique: true
      // allowNull: false
    },
    name: {
      type: DataTypes.STRING
      // allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
      // allowNull: false
    },
    password: {
      type: DataTypes.STRING
      // allowNull: false
    },
    introduction: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://i.imgur.com/q6bwDGO.png'
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue: 'https://i.imgur.com/1jDf2Me.png'
    },
    tweetCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    modelName: 'User',
    tableName: 'Users'
  })
  User.associate = function (models) {
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    // 跟隨User的人
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    // User跟隨的人
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  }
  return User
}
