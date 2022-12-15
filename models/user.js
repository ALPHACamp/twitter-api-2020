'use strict'
const {
	Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate (models) {
			User.hasMany(models.Tweet, { foreignKey: 'userId' })
			User.hasMany(models.Reply, { foreignKey: 'userId' })
			User.hasMany(models.Like, { foreignKey: 'userId' })
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
		}
	}
	User.init({
		// Model attributes are defined here
		account: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		name: DataTypes.STRING,
		avatar: DataTypes.STRING,
		introduction: DataTypes.TEXT,
		cover: DataTypes.STRING,
		role: DataTypes.STRING
	}, {
		// Other model options go here
		sequelize, // We need to pass the connection instance
		modelName: 'User', // We need to choose the model name
		tableName: 'Users',
		underscored: true
	})
	return User
}
