'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    User1Id: {
      type: DataTypes.INTEGER,
    },
    User2Id: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {});
  Room.associate = function (models) {
    Room.belongsTo(models.User, { foreignKey: "User1Id", as: "User1" })
    Room.belongsTo(models.User, { foreignKey: "User2Id", as: "User2" })
    Room.hasMany(models.Message, { foreignKey: "RoomId", as: "Messages" })
  };
  return Room;
};