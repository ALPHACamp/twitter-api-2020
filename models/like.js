'use strict'

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    TweetId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {})
  Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: 'userId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
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
