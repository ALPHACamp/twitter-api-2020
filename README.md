# Twitter API

API server for twitter clone project.

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
4. Open up command line tool and input below commands:

```
npx sequelize db:migrate
npx sequelize db:seed:all
```
5. start server and test APIs with Postman

```
npm run start

or

npm run dev
```