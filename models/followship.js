'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    follower_id: {
      type: DataTypes.INTEGER,
    },
    following_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: DataTypese.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  });
  Followship.associate = function (models) {
  };
  return Followship;
};