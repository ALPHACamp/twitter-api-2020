"use strict";
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {}, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User);
    Like.belongsTo(models.Tweet);
  };
  Like.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "Likes",
      underscored: true,
    }
  );
  return Like;
};
