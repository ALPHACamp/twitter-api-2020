# Simple Twitter

![screenshot](public/images/demo.png)

## About

---

Redesign the popular micro-blogging platform twitter.com.
Mocking the basic functions as below:

- admin content management
- user account and profile
- social interaction: post tweets, reply tweets, like tweets, user followship
- popular users list
  <br><br>

## Website

---

[Visit our beautiful website!](https://liam67726978.github.io/simple-twitter)
<br><br>

## API

---

[Get to know how to use our API.](https://yoruyeh.notion.site/API-2c3cc2ba2b194c9baa9ce3df08630569?pvs=4)
<br><br>

## Environment

---

- node v14.16.0
- nodemon
  <br><br>

## Installation and Execution

---

### 1. Git Clone to Local

```
 git clone https://github.com/KenYuChang/twitter-api-2020   # git clone
 cd twitter-api-2020                                        # enter project folder
 npm install                                                # install NPM Packages
```

### 2. Create Database in SQL WorkBench

```
create database ac_twitter_workspace
```

### 3. Database Migration and Seeder

```
npx sequelize db:migrate    # model migration
npx sequelize db:seed:all   # generate seed
```

### 4. Create .env file for confidential (ref: .env.example)

```
IMGUR_CLIENT_ID= your password
JWT_SECRET= your password
```

### 5. Start Server (nodemon)

```
npm run dev
```

### 6. Terminal

```
Example app listening on port 3000!
```

<br>

## Seed Accounts

---

1 admin account and 9 user accounts are provided for demo.<br>

### # Admin Account

account: root <br>
email: root@example.com <br>
password: 12345678 <br>

### # User Account

account: user1 <br>
email: user1@example.com <br>
password: 12345678 <br>
<br>

## Development Tools

---

- Node.js
- Express
- MySQL
- Sequelize
- React
  <br><br>

## Team Members

---

### Front-End

[Yoru Yeh](https://github.com/Yoruyeh)<br>
[Liam](https://github.com/Liam67726978)

### Back-End

[Ken Yu Chang](https://github.com/KenYuChang)<br>
[Jasmine Huang](https://github.com/Jasmineeds)