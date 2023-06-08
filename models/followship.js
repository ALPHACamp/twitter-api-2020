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
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  };
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    // underscored: true
  })
  return Followship
}
