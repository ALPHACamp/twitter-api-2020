'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
// const env = process.env.NODE_ENV || 'development'
// (上1) 原本的，(下1) 因為消不掉 package.json 裡 script 內 NODE_ENV 的空格，所以用 trim()
const env = (process.env.NODE_ENV || 'development').trim()
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
// (下1) 原本的，上面成功再看要不要殺
// const config = require(__dirname + '/../config/config.json')[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  // sequelize = new Sequelize(config.database, config.username, config.password, config) // 這是原始版，下面測試
  sequelize = new Sequelize(config.database, config.username, config.password, { ...config })
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
