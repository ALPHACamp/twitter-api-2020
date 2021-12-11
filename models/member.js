'use strict'
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      content: DataTypes.TEXT,
      GiverId: DataTypes.INTEGER
    },
    {}
  )
  Member.associate = function (models) {
    // associations can be defined here
  }
  return Member
}
