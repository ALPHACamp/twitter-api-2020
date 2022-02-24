'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {})
  Tweet.associate = function (models) {
  }
  return Tweet
}
