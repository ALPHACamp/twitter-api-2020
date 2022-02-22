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
    tableName: 'Tweets'
  })
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Reply, { ForeignKey: 'TweetId' })
  }
  return Tweet
}
