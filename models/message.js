'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    RoomId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User, { foreignKey: "UserId", as: "Author" })
    Message.belongsTo(models.Room, { foreignKey: "RoomId", as: "Room" })
  };
  return Message;
};