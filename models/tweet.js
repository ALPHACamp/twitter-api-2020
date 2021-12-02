"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      UserId: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {}
  );
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply);
    Tweet.hasMany(models.Like);
    Tweet.belongsTo(models.User);
  };
  //foreignKeyConstraint: true,onDelete: 'cascade',
  //onDelete: 'cascade',foreignKey: { allowNull: false },hooks: true,

  return Tweet;
};
