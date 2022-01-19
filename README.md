# Simple Twitter (backend API)

This is a backend API for simple twitter, which is created with Node.js, express.js and MySQL. 



 ## Table of contents

* [General Information](#general-information)
* [About Our Service](#about-our-service)
* [Features](#features)
* [Installation](#installation)
* [Inspiration](#nspiration)



## General Information

We try to simplify demands about the Twitter website, and support most of the main functions, which includes four parts: Admin, User, Tweet and Followship.



## About Our Service

### API document

Our API detail information could be checked in the Swagger openapi 3 [link](https://app.swaggerhub.com/apis-docs/ccyang02/SimpleTwitter/1.1.1).

### Sandbox server

We also build a sandbox server with testing data on the cloud application platform [Heroku](https://dashboard.heroku.com/apps). Our hostname is https://merry-simple-twitter.herokuapp.com/.



## Features

| Parts      | Features                                                     |
| ---------- | ------------------------------------------------------------ |
| Admin      | signin, get all tweets, delete any tweets, get data of all users and their related communities |
| User       | signup, signin with authentication, get various information about user and update personal info |
| Tweet      | get all tweets, get tweet details, post, like, dislike, reply a tweet |
| Followship | follow or cancel following to a user                         |



## Installation

### Getting Started

- Clone repository to your local project.

```bash
git clone https://github.com/ccyang02/twitter-api-2020.git
```

- Install dependencies.

```bash
cd twitter-api-2020
npm install
```

- Setup your own MySQL database ( details in `/config/config.json`) and seed data.

```bash
# after preparing your database, migrate the database and add seed data 
npx sequelize db:migrate
npx sequelize db:seed:all

# if you need to undo all the actions, please use the commands.
npx sequelize db:migrate:undo:all
```

- Setup environment variables.

```bash
touch .env
# according to .env.example, please add the variables in the .env

# IMGUR_CLIENT_ID is a client id from imgur service, if update personal information is in need, please apply for their service.
# imgur service: https://api.imgur.com/oauth2/addclient 
```

- Start the service and test on http://localhost:port/.

```bash
npm run dev
```

- Test on [Postman](https://www.postman.com/) according to our API documents.

```
POST /api/signin
```



### Built with

- Node.js: 10.16.0
- express: 4.16.4
- mysql2: 1.6.4
- sequelize: 4.42.0
- sequelize-cli: 5.5.0



## Inspiration

Appreciate my co-work team members [Kaikai8888](https://github.com/Kaikai8888) to finish this project together.