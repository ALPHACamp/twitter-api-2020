'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.hasMany(models.Message)
      Room.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'Creator'
      })
      Room.belongsTo(models.User, {
        foreignKey: 'joinerId',
        as: 'Joiner'
      })
      Room.belongsToMany(models.User, {
        through: models.RoomUser,
        foreignKey: 'RoomId',
        as: 'UsersInRoom'
      })
    }
  };
  Room.init({
    creatorId: DataTypes.INTEGER,
    joinerId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};