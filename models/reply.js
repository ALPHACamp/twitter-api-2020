<<<<<<< HEAD
'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    // id: {
    //   primaryKey: true,
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER
    // },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply'
  })
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
  }
  return Reply
}
=======
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
  }, {});
  Reply.associate = function (models) {
    // Reply.belongsTo(models.Tweet)

  };
  return Reply;
};
>>>>>>> b6cdbe55117f2074cca54fd76d2f33e5cec6a5be
