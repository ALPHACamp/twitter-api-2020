'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    tableName: 'Replies'
  })
  Reply.associate = function(models) {
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  return Reply
}