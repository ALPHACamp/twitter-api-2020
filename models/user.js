// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // Reply.belongsTo(models.Tweet)
//       // define association here
//       User.hasMany(models.Reply)
//       User.hasMany(models.Tweet)
//       User.belongsToMany(models.Tweet, {
//         through: models.Like,
//         foreignKey: 'UserId',
//         as: 'LikedTweets'
//       });
//       User.belongsToMany(User, {
//         through: models.Followship,
//         foreignKey: 'followingId',
//         as: 'Followers'
//       });
//       User.belongsToMany(User, {
//         through: models.Followship,
//         foreignKey: 'followerId',
//         as: 'Followings'
//       });
//     }
//   };
//   User.init({
//     account: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     name: DataTypes.STRING,
//     avatar: DataTypes.STRING,
//     cover: DataTypes.STRING,
//     introduction: DataTypes.STRING,
//     role: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };


'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.STRING,
      account: DataTypes.STRING,
      cover: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'RepliedTweets'
    })

    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  }
  return User
}