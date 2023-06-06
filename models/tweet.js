"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define("Tweet", {}, {});
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Like);
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' });
    Tweet.belongsTo(models.User, { foreignKey: 'userId' });
  };
  Tweet.init(
    {
      userId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Tweet",
      tableName: "Tweets",
      underscored: true,
    }
  );

  return Tweet;
};
