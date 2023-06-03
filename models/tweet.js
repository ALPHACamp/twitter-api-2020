"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define("Tweet", {}, {});
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply);
    Tweet.hasMany(models.Like);
    Tweet.belongsTo(models.User);
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
