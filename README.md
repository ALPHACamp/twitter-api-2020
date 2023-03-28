# Simple Twitter API

This project, Simple Twitter, has been developed using a front-end and back-end separation model. This repository is for the back-end and contains information about the API provided by the back-end.

# [API Documents](https://www.notion.so/API-469a52bfc4f94f9ab300132e4b324166#f002277fef914b7180927fbe8b5e44f7)

# Product Features

### Administator

- View all tweets from users
- Delete any tweet
- View all user information

### Users

- Register a new account and login to the website
- Post tweets and view all tweets
- Reply to other tweets
- Like / unlike other tweets
- Follow / unfollow other Users
- Edit personal information including account, name, email, password, self-introduction, avatar etc.
- View all tweets, replies, liked tweets, as well as the follower and following lists of the user on personal page
- View the top ten recommended users to follow

# Install

1. Install Node.js, npm, nodemon, MySQL
2. Clone this project to your local repository
3. Change directory to project folder
4. Install npm packages `npm install`
5. Create a .env file based on the instruction of .env.example
6. Set your own MySQL setting in config/config.json

   ```json
   "development": {
       "username": "<user name>",
       "password": "<user password>",
       "database": "<database name>",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   ```

7. Run migration files and load seed data

   ```
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

8. Run project `npm run dev`
9. You will see this message when the project has been successfully executed

   ```
   Example app listening on port 3000!
   ```

# Test Account

### **Administrator**

account : root

password: 12345678

### **User**

account : user1

password: 12345678

# Developers

### [Frank](https://github.com/yhhuangfrank)

### [Wei](https://github.com/wego11ya)
