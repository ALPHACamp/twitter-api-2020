'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TweetId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true,
      timestamps: false
    }
  )
  Like.associate = function (models) {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  }
  return Like
}
