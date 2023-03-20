'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    "Reply",
    {
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      TweetId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    },
    { sequelize, modelName: "Tweet", tableName: "Tweets", underscored: true }
  );
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  }
  return Reply
}
