'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {
      modelName: "Tweet",
      tableName: "Tweets",
    }
  );
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User, { foreignKey: "UserId" });
    Tweet.hasMany(models.Reply,{foreignKey: "TweetId"})
    Tweet.hasMany(models.Like,{foreignKey: 'TweetId'})

  };
  return Tweet;
};