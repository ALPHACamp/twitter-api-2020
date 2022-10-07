'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {});
  Like.associate = function(models) {
  };
  return Like;
};
'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // define association here
    }
  };
  Like.init({
    userId: DataTypes.STRING,
    tweetId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  })
  return Like
}