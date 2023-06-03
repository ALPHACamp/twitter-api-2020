"use strict";
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define("Reply", {}, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.User);
    Reply.belongsTo(models.Tweet);
  };
  Reply.init(
    {
      userId: DataTypes.INTEGER,
      tweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Reply",
      tableName: "Replies",
      underscored: true,
    }
  );
  return Reply;
};
