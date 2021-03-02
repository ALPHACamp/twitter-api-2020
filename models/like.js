<<<<<<< HEAD
'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like'
  })
  Like.associate = function (models) {
    Like.belongsTo(models.User)
  }
  return Like
}
=======
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {});
  Like.associate = function (models) {
    // Like.belongsTo(models.Tweet)
  };
  return Like;
};
>>>>>>> b6cdbe55117f2074cca54fd76d2f33e5cec6a5be
