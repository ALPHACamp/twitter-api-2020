'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    replyCount: {
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
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Reply, { ForeignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { ForeignKey: 'TweetId' })
  }
  return Tweet
}
