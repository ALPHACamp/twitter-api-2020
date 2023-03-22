'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
    // define association here
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    }
  }
  Tweet.init({
    UserId: DataTypes.INTEGER, // 因為測試檔 (test/request/user.spec.js) 而改大駝峰
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
