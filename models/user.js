module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://www.seekpng.com/png/full/114-1149972_avatar-free-png-image-avatar-png.png'
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue: 'https://www.seekpng.com/png/full/153-1536586_free-facebook-cover-image-transparent-png-facebook-cover.png'
    },
    introduction: DataTypes.TEXT,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    }
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
  }
  return User
}
