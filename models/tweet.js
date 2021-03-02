<<<<<<< HEAD
'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    // id: {
    //   primaryKey: true,
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER
    // },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  Tweet.associate = function (models) {
    
    Tweet.belongsTo(models.User)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })

    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'ReplyUsers',
    })
  }
  return Tweet
}
=======

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    // id: { type: DataTypes.INTEGER, primaryKey: true },
    description: DataTypes.TEXT

  }, {});
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)

  };

  return Tweet;
};

>>>>>>> b6cdbe55117f2074cca54fd76d2f33e5cec6a5be
