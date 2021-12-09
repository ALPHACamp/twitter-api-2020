'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {}
  )
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers',
    })
  }
  return Tweet
}
