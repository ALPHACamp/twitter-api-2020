'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
    },
    {
      modelName: "Like",
      tableName: "Likes",
    }
  );
  Like.associate = function(models) {
    Like.belongsTo(models.Tweet, { foreignKey: "TweetId" });
    Like.belongsTo(models.User, { foreignKey: "UserId" });
  };
  return Like;
};