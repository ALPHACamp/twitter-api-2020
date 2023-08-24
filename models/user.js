'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Tweet, { foreignKey: 'userId', as: 'author' })
      User.hasMany(models.Reply, { foreignKey: 'userId', as: 'replier' })

      // User.belongsTo(models.Tweet, { foreignKey: "userId", as: "likedTweets" });
      // User.belongsTo(models.Tweet, {
      //   foreignKey: "userId",
      //   as: "likedReplies",
      // });

      User.hasMany(models.Like, { foreignKey: 'userId' })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      role: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
