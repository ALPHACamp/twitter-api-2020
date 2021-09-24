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
      Room.hasMany(models.User)
      Room.belongsToMany(models.User, {
        through: models.RoomUser,
        foreignKey: 'RoomId',
        as: 'UsersInRoom'
      })
    }
  };
  Room.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};