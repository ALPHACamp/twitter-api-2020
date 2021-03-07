# Twitter API

API server for twitter clone project.

## 2020.03.07 udpate
Update Twitter API to v 2.0.0, updates:

**Add three routes:**
1. GET /api/admin/tweets
return a list of all the tweets in website
2. GET /api/users/top
return a list of all the users, sorted by followers count
3. PUT /api/users/{id}/account

**Modify one route:**
1. GET /api/users/{id}
add isFollowed: Boolean to response data

## Check API doc
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

## Test with localhost

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

