'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
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
  };
  return User;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     static associate(models) {
//       User.hasMany(models.Reply)
//       User.hasMany(models.Tweet)
//       User.hasMany(models.Like)
//       User.belongsToMany(User, {
//         through: models.Followship,
//         foreignKey: 'followingId',
//         as: 'Followers'
//       })
//       User.belongsToMany(User, {
//         through: models.Followship,
//         foreignKey: 'followerId',
//         as: 'Followings'
//       })
//     }
//   };
//   User.init({
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     isAdmin: DataTypes.BOOLEAN,
//     avatar: DataTypes.STRING,
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };
