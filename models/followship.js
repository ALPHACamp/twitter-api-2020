// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Followship = sequelize.define('Followship', {
//     followerId: DataTypes.INTEGER,
//     followingId: DataTypes.INTEGER
//   }, {
//     tableName: 'Followships',
//     underscored: true,
//   });
//   Followship.associate = function(models) {
//   };
//   return Followship;
// };

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {
      Followship.belongsTo(models.User, {
        as: 'Follower',
        foreignKey: 'followerId'
      })
      Followship.belongsTo(models.User, {
        as: 'Following',
        foreignKey: 'followingId'
      })
    }
  }
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
