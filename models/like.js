'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {})
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
  }
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}
