# Simple Twitter API  
A RESTful API server for Simple Twitter project built with Node.js, Express framework, and MySQL.  

This is a collaborate project to make a simple Twitter web app. And the server-side API majors in authentication and data CRUD features.  


:sparkles: **Simple Twitter API** is hosted on Heroku now. You can give it a try by using following base URL.  
```
https://twitter-api-2022.herokuapp.com
```

:sparkles: **Simple Twitter Demo** is hosted [here](https://ziwenying.github.io/simple-twitter-frontend/#/login). You can use the following accounts to login and try all the features:  
```
Admin
account: root
password: 12345678

Users(provide 11 seed users)
account: user1 (~user11)
password: 12345678
```

## API Features  
### Authentication  
Check if the user is authenticated and authorized. Some routes are available to use after login, some are admin/user role only. Please refer to the API documents.  
### Admin  
* Signin background(後台)
* Get the list of all users  
* Get the list of all tweets  
* Delete tweet  
### Users
* Signin foreground(前台)
* Signup an new account  
* Post, like, reply or read a tweet  
* Follow, unfollow other users  
* Edit own profile(include upload image)  
* Get data of a certain user(personal info, tweets, likes, followings, followers, replies)  

## API Documents  
* [English verion](./api-docs/index.md)  
* [Chinese verion](https://hackmd.io/@twitter-2022/API-index)  

## Build a local API server  
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.  

### Prerequisites
Node.js, Express and MySQL are installed.

### Installing
#### Clone the repo  
```
git clone https://github.com/ritachien/twitter-api-2022.git
```
#### Install dependencies  
```
npm install
```
#### Create file and folder in root  
* Create a `.env` file and set variables(see `.env.example`). Notice that `JWT_SECRET` is required and `IMGUR_CLIENT_ID` is optional.
* Make a `temp` folder for image upload feature.  
#### Setting for database  
* Modify `/config/config.json`
```
"username": <your mysql username>,
"password": <your mysql password>,
```
* Create database to your MySQL  
```SQL
CREATE DATABASE ac_twitter_workspace;
CREATE DATABASE ac_twitter_workspace_test;
```
* Migrations and seeds(run in terminal)  
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
### Start the server  
```
npm start
```

## Auto-testing
There are auto-test files for models and requests in this repo. Look for more details in  `/test` folder.

### Set NODE_ENV before test  
```
export NODE_ENV=test  // macOS
set NODE_ENV=test  // windowsOS
```
### Run the tests  
```
npm run test
```
### Set NODE_ENV after test  
```
export NODE_ENV=developemnt  // macOS
set NODE_ENV=development  // windowsOS

```
### Check current enviornmment  
```
echo $NODE_ENV  // macOS
echo %NODE_ENV%  // windowsOS
```

## Built With  

* [Express](https://expressjs.com/) - The framework used  
* [MySQL](https://www.mysql.com/) - Database  
* [Heroku](https://www.heroku.com/platform) - Where API hosted  

## Authors  
* [Ruby Lo](https://github.com/rubylo718)  
* [Rita Chien](https://github.com/ritachien)  

List of [contributors](https://github.com/ritachien/twitter-api-2022/contributors) who participated in this project.  
