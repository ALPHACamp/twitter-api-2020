# Alphitter API
## This API project is for a simple Twitter 
There are two places ( background and foreground ) to login.Background for admin and foreground for normal user.
## Getting Started
For local user make sure you've installed Node.js@14.16.0, npm, and MySQL 
### Initialized 
1. Switch to your Terminal(for MacOS) or git-bash(for Windows)
```
git clone https://github.com/shanelin0904/twitter-api-2022.git
```
2. Change direction to this project
```
cd twitter-api-2022
```
3. Install required dependencies
```
npm install
```
4. Create a .env  file and add environment variables according to the following .env.example
```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
```
5. Run these SQL queries to create  databases that are correspond to the project in MySQL 
```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```
6. Create database tables by
```
npx sequelize db:migrate
```
7. Load seeders
```
npx sequelize db:seed:all
```
8. Lauch the server by
```
node app.js
```
9. When the following words appear on the terminal, it means the execution is successful
```
Example app listening on port
```

### Automated test
Execute all tests by setting 
```
NODE_ENV=test
npm run test
```
Execute single test by setting 
```
NODE_ENV=test
npx mocha test/{{ Model or Request }}/{{Model or Request}}.spec.js --exit
```

## Product feature 
* User can register/login account
* Users can add tweets
* Users can interact (reply, follow, like, view top followers users)
* Background administrators can browse the Tweet list of the whole site and delete tweets
* Background administrators can browse all user lists in the site
## API documents 
https://www.notion.so/Twitter-API-DOC-aa3701046a1d48e5a7e63dcb8a8f3395

## Developer 
[CK](https://github.com/Gincoolwant) [Shane Lin](https://github.com/shanelin0904)
