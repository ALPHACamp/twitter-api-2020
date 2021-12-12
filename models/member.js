'use strict'
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      RoomId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  )
  Member.associate = function (models) {
    // associations can be defined here
    Member.belongsTo(models.User)
  }
  return Member
}
