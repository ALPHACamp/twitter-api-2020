'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.TEXT(140)
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {})
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  }
  Tweet.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT(140)
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
