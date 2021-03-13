# Twitter API

API server for twitter clone project. Hosted on Heroku:

https://salty-headland-68177.herokuapp.com/

## 2020.03.08 udpate
Update Twitter API to v 2.1.0, updates:

**Add one route:**
1. POST /api/admin/login: 

This route is for admin login. General user will be blocked. On the other hand, admin is not able to login through user login route (/api/users/login).

## 2020.03.07 udpate
Update Twitter API to v 2.0.0, updates:

**Add three routes:**
1. GET /api/admin/tweets: 

Return a list of all the tweets in website

2. GET /api/users/top: 

Return a list of all the users, sorted by followers count

3. PUT /api/users/{id}/account: 

For user to revise their account name, user name, email, and password. 

**Modify two routes:**
1. GET /api/users/{id}

Add isFollowed: Boolean to response data

2. GET /api/tweets

Now only returns the tweets that are followed by the user

## Check API doc with Heroku
Use below link:

https://salty-headland-68177.herokuapp.com/api-doc/

## Check API doc locally
1. Install server dependencies

```
npm install
```
2. start server

```
npm run start

or

npm run dev
```

3. Check api spec with below URI in browser:

http://localhost:3000/api-doc

## Test with local db

1. Install MySQL

- Windows: https://dev.mysql.com/downloads/windows/installer/
- MacOS: https://dev.mysql.com/downloads/mysql

2. Connect Workbench with MySQL server

3. Input query

```
create database ac_twitter_workspace
```
4. Open up Twitter API project command line tool and input below commands:

```
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
```
5. start server and test APIs with Postman

```
npm run start

or

npm run dev
```

