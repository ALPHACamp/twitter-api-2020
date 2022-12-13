'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: 'userId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  }
  return Like
}
