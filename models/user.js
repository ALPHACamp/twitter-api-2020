'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Reply, { foreignKey: 'replyId' })
      User.hasMany(models.Tweet, { foreignKey: 'tweetId' })
      User.hasMany(models.Like, { foreignKey: 'likeId' })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers' // 幫關係取名字，我先想成命名一個 table，也就是說，這張表是 followers，它會記錄這個 followingId 被那些 follower follow 了
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings' // 假設是張表，表的名字 followings(被追蹤者)，意思是 "藉由搜尋某一 followerId，找到他 following 的人們"
      })
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    isAdmin: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 這是手動新增的，好像有原因
    underscored: true
  })
  return User
}
