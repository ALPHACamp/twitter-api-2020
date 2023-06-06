'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {

  }, {
     modelName: 'User',
     tableName: 'Users'
  });
  User.associate = function(models) {
    User.hasMany(models.Tweet);
    User.hasMany(models.Reply);

  };
  return User;
};