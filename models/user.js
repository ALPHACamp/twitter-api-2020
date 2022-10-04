'use strict'
module.exports = (sequelize, DataTypes) => {
  // sequelize.define(modelName, attributes, options)
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING(50) // 上限50字
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT(160)
    },
    role: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    paranoid: false,
    underscored: true
  })
  User.associate = function (models) {
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
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
