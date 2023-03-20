'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      UserId: {
        type: Sequelize.INTEGER,
      },
      TweetId: {
        type: Sequelize.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "Likes",
      underscored: true,
    }
  );
  Like.associate = function (models) {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  }
  return Like
}
