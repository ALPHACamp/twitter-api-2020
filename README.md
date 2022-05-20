# Simple Twitter API

An API server built on Express.js framework in Node.js and MySQL database for Simple Twitter. Authenticated by token-based with passport-JWT.

You could click [this link](https://limecorner.github.io/simple-twitter) and through following accounts and passwords to login to enjoy all features.

Role | Account | Password
--- | --- | ---
Admin | root | 12345678
User | user1 | 12345678

## API Document

More details of API, please refer this [API document]((https://documenter.getpostman.com/view/20220901/UyxjF5qH#intro)) created through postman.

## Getting Start

### **Environment Setup**

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [MySQL](https://dev.mysql.com/downloads/mysql/)
* [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
* [Imgur](https://api.imgur.com/oauth2/addclient)
* [Multer](https://www.npmjs.com/package/multer)

### **Installation**

**Be sure to meet above environment setup requirement.**

1. Clone  this project to local

```
$ git clone https://github.com/winnielinn/twitter-api-2022
```

2. Change directory

```
$ cd twitter-api-2022
```

3. Install all dependencies

```
$ npm install
```

### **Configuration**

**.env file**

Please refer `.env.example` and create `.env` to set environment variable.

```
PORT=
JWT_SECRET=
IMGUR_CLIENT_ID=
```

**config/config.json**

Finish database connection setting in `config/config.json` for development and test environment.

```
{
  "development": {
    "username": "root",
    "password": "<your_password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "<your_password>",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}
```

**Create database**

In MySQL Workbench, create test/development database by entering following SQL command.

```
drop database if exists ac_twitter_workspace_test; 
create database ac_twitter_workspace_test;
drop database if exists ac_twitter_workspace; 
create database ac_twitter_workspace;
```

**Database migration**

Using Sequelize command, create tables through migration files in test and development environment separately.

```
$ export NODE_ENV=test
$ npx sequelize db:migrate
```

```
$ export NODE_ENV=development
$ npx sequelize db:migrate
```
### **Test**

To make sure all features are working properly, use the following commands. If you encounter test errors, make sure you have set up as above.

```
$ export NODE_ENV=test
$ npm run test
``` 

### **Usage**

**Create seed data**

Through Sequelize command to establish seed data in development environment.

```
$ export NODE_ENV=development
$ npx sequelize db:seed:all
```

**Start server**

Run server on localhost. If successful, `Example app listening on port 3000!` will show in terminal.

```
$ npm run start
```

If you have installed [nodemon](https://www.npmjs.com/package/nodemon), you could use this command.

```
$ npm run dev
```

**Stop server**

Pressing Ctrl + C to stop server running.

## Contributor

* [Winnie Lin](https://github.com/winnielinn)
* [Tang](https://github.com/hitpop2216)
