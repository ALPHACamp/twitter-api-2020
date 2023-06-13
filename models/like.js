'use strict';
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
<<<<<<< HEAD
=======
    
>>>>>>> e08c474e301b8a9cea3aef7e53ba83f7fc7f8acd
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  };
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
<<<<<<< HEAD
}
=======
}
>>>>>>> e08c474e301b8a9cea3aef7e53ba83f7fc7f8acd
