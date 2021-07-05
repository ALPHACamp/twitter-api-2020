'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Admin.associate = function(models) {
    Admin.hasMany(models.Tweet, {
      foreignKey:"AdminId"
    });
  };
  return Admin;
};