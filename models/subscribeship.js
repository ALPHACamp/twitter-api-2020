'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscribeship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subscribeship.belongsTo(models.User, {
        through: 'Subscribeship',
        foreignKey: 'subscriberId',
        as: 'Subscriber',
      })
    }
  };
  Subscribeship.init({
    subscriberId: DataTypes.INTEGER,
    subscribingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Subscribeship',
  });
  return Subscribeship;
};