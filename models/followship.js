"use strict";
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define("Followship", {}, {});
  Followship.associate = function (models) {};
  Followship.init(
    {
      followingId: DataTypes.INTEGER,
      followerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Followship",
      tableName: "Followships",
      underscored: true,
    }
  );
  return Followship;
};
