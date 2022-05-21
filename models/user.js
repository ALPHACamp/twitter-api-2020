'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })
      User.hasMany(models.Followship, { foreignKey: 'followerId' })
      User.hasMany(models.Followship, { foreignKey: 'followingId' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedTweets'
      })
      User.belongsToMany(models.Reply, {
        through: models.LikedReply,
        foreignKey: 'UserId',
        as: 'LikedReplies'
      })
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
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    account: {
      type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    introduction: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
