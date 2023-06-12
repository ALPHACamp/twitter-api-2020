// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Reply = sequelize.define('Reply', {
//     UserId: DataTypes.INTEGER,
//     TweetId: DataTypes.INTEGER,
//     comment: DataTypes.TEXT
//   }, {
//     tableName: 'Replies',
//     underscored: true,
//   });
//   Reply.associate = function(models) {
//     Reply.belongsTo(models.User, { foreignKey: 'userId' })
//   };
//   return Reply;
// };

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  };
  Reply.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
  })
  return Reply
}
