'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    UserId: {
      type: Sequelize.INTEGER
    },
    description: {
      type: Sequelize.TEXT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  });
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
  };
  return Tweet;
};