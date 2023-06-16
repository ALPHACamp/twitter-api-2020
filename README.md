# Simple Twitter API 2023

## v1.0.0

## About The Project
![Alt text](image-1.png)

A RESTful API server for Simple Twitter project built with React, Node.js, Express framework, and MySQL.

## Usage

Through this web program, after the user registers an account, users can use post, reply to other user's tweets, like other users' tweets, track other users, and use the account settings functions like uploading profile picture, uploading cover page photo, etc.

_Check this out to view more - [documentation](https://magic9701.github.io/Simple-Twitter/)_

### Base URL
   ```sh
https://pure-falls-11392.herokuapp.com/
   ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/av124773/twitter-api-2020.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create database via SQL WorkBench(enter in WorkBench Application)
   ```sh
   create database ac_twitter_workspace
   ```
4. Create models
   ```sh
   npx sequelize db:migrate
   ```
5. Create built-in data via seeds
   ```sh
   npx sequelize db:seed:all
   ```
6. Establish .env file and put passowrds in
   ```sh
   IMGUR_CLIENT_ID= 'YOUR PASSWORD'
   JWT_SECRET= 'YOUR PASSWORD'
   ```
7. Start the server
   ```sh
   - MacOS
    npm run start
   - Windows OS
    npm run startWin
   ```

## Getting Started
Use the default accounts to login
   ```sh
   - User
    account: user1
    email: user1@example.com
    password: 12345678
   - Admin
    account: root
    email: root@example.com
    password: 12345678
   ```

## Environment
- node: ^v14.16.0,
- nodemon

## Built With
- bcrypt-nodejs: ^0.0.3,
- bcryptjs: ^2.4.3,
- body-parser: ^1.18.3,
- chai: ^4.2.0,
- connect-flash: ^0.1.1,
- cors: ^2.8.5,
- dotenv: ^16.1.4,
- express: ^4.16.4,
- express-session: ^1.15.6,
- faker: ^4.1.0,
- imgur: ^1.0.2,
- jsonwebtoken: ^8.5.1,
- method-override: ^3.0.0,
- mocha: ^6.0.2,
- multer: ^1.4.4,
- mysql2: ^1.6.4,
- passport: ^0.4.1,
- passport-jwt: ^4.0.0,
- passport-local: ^1.0.0,
- sequelize: ^6.18.0,
- sequelize-cli: ^5.5.0,
- sinon: ^10.0.0,
- sinon-chai: ^3.3.0,
- tslib: ^2.5.3
- (前端開發待補上)

## Contributors
- Kelly Ko [https://github.com/magic9701](https://github.com/magic9701)
- Kevin_L [https://github.com/av124773](https://github.com/av124773)
- Chia-Hsuan Chu [https://github.com/jiasyuanchu](https://github.com/jiasyuanchu)
- Aray [https://github.com/aray81205](https://github.com/aray81205)