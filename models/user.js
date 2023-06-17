// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     name: DataTypes.STRING,
//     avatar: DataTypes.STRING,
//     introduction: DataTypes.TEXT,
//     role: DataTypes.STRING,
//   }, {});
//   User.associate = function(models) {
//     User.hasMany(models.Reply, { foreignKey: 'userId' })
//     User.hasMany(models.Tweet, { foreignKey: 'userId' })
//     User.hasMany(models.Like, { foreignKey: 'userId' })
//     User.belongsToMany(User, {
//       through: models.Followship,
//       foreignKey: 'followingId',
//       as: 'Followers'
//     })
//     User.belongsToMany(User, {
//       through: models.Followship,
//       foreignKey: 'followerId',
//       as: 'Followings'
//     })
//   };
//   return User;
// };

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Reply, { foreignKey: 'userId' })
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Like, { foreignKey: 'userId' })
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
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    banner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
