// 可以通過測試的寫法
'use strict';
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {
    }
  }
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    // tableName: 'Followships',
    // underscored: true
  })
  return Followship
};
// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Followship = sequelize.define('Followship', {
//     followerId: DataTypes.INTEGER,
//     followingId: DataTypes.INTEGER
//   }, {});
//   Followship.associate = function (models) {
//     // associations can be defined here
//   };
//   return Followship;
// };