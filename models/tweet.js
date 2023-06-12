// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Tweet = sequelize.define('Tweet', {
//     UserId: DataTypes.INTEGER,
//     description: DataTypes.TEXT
//   }, {
//     tableName: 'Tweets',
//     underscored: true,
//   });
//   Tweet.associate = function(models) {
//     Tweet.belongsTo(models.User, { foreignKey: 'userId' })
//   };
//   return Tweet;
// };

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
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
  })
  return Tweet
}
