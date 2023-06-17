// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Like = sequelize.define('Like', {
//     UserId: DataTypes.INTEGER,
//     TweetId: DataTypes.INTEGER
//   }, {
//     tableName: 'Likes',
//     underscored: true,
//   });
//   Like.associate = function(models) {
//     Like.belongsTo(models.User, { foreignKey: 'userId' })
//   };
//   return Like;
// };

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  };
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Like',
    tableName: 'Likes'
  })
  return Like
}
