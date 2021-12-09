'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    RoomId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
    
  };
  return Member;
};