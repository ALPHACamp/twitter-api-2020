'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  });
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Tweet;
};