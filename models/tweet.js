'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', 
  {
    id: {
      allowNull:false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
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
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId'})
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId'})
    Tweet.belongsTo(models.User, { foreignKey: 'UserId'})
  };
  Tweet.init({
    UserId: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
  })
  return Tweet;
};