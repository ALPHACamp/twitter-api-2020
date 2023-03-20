const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Reply, {
        foreignKey: 'UserId',
      });
      User.hasMany(models.Tweet, {
        foreignKey: 'UserId',
      });
      User.hasMany(models.Like, {
        foreignKey: 'UserId',
      });

      // Who follows this user
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings',
      });

      // Ths user is following another user
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers',
      });
    }
  }

  User.init(
    {
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      coverImage: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
    }
  );
  return User;
};
