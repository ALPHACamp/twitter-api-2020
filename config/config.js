require('dotenv').config()
module.exports = {
  "development": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "use_env_variable": "CLEARDB_DATABASE_URL",
  },
  "aws": {
    "host": process.env.RDS_HOSTNAME,
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": 'AWStwitter',
    "dialect": "mysql",
  },
  "travis": {
    "username": "travis",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}