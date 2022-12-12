module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {})
  User.associate = function (models) {
  }
  User.init({
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
    avator: DataTypes.STRING,
    introduction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
