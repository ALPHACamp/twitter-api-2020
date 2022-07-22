'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
  }
  return Tweet
}
