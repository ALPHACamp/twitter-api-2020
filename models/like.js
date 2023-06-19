'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {})
  Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  Like.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
  return Like
}
