'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', 
  {
    id: {
      allowNull:false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING
    },
    createdAt:{
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt:{
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User;
};