# Simple Twitter API

A RESTful API server for Simple Twitter project built with Node.js, Express framework, and MySQL.

Project Demo: [https://ga686.github.io/simple-twitter](https://ga686.github.io/simple-twitter)

Simple-Twitter-Frontend: [https://github.com/ga686/simple-twitter](https://github.com/ga686/simple-twitter)

you can use the account below to login the live project:

```
Test User:
Account: user1
Password: 12345678

Admin:
Account: root
Password: 12345678
```

## API Guideline

Please check our [API Docs](https://app.swaggerhub.com/apis-docs/yellaatthebeach/Twitter/1.0.0#/) for more information. All URLs referenced in the API documentation, you can see in the following host and base path: 

```
https://simple-twitter-22105.herokuapp.com/api
```

## Installation

The following instructions will get you a copy of the project and all the setting needed to run on your local machine.

**Prerequisites**

• [npm](https://www.npmjs.com/get-npm)

• [Node.js v16.15.1](https://nodejs.org/en/download/)

• [MySQL v8.0.30](https://dev.mysql.com/downloads/mysql/)

• [MySQL Workbench v8.0.30](https://dev.mysql.com/downloads/workbench/)

**1. Clone the repository**

```
$ git clone https://github.com/AlleyCC/twitter-api-2022.git
```

**2. Enter the project folder**

```
$ cd twitter-api-2022
```

**3. Install project dependencies**

```
$ npm install
```

**4. Add .env file**

```
$ touch .env
$ touch .env.example
```

**5. Store your private key in .env file**

Register your own IMGUR client id on [IMGUR](https://api.imgur.com/oauth2)

```
JWT_SECRET=<jwt_secret>
IMGUR_CLIENT_ID=<imgur_client_id>
```

**6. Create database via MySQL Workbench**

Run the code below

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

**7. Enter your MySQL Workbench password in config.json file**

```
{
  "development": {
    "username": "root",
    "password": "<WORKBENCH_PASSWORD>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "<WORKBENCH_PASSWORD>",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
```

**8. Run migration to create tables in database**

```
$ npx sequelize db:migrate
$ NODE_ENV=test
$ npx sequelize db:migrate
```

**9. Import seed data**

```
$ NODE_ENV=development
$ npx sequelize db:seed:all
```

**10. Activate your local server**

```
$ npm run dev
```

you will see the message: `Example app listening on port 3000!`

## **Authors**

[Darren](https://github.com/darrenjon)

[AlleyCC](https://github.com/AlleyCC)
