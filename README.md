- # Twitter API
- The goal of this project is to build a web backend API server for the Simple Twitter website using Node.js, Express, and MySQL.
- Ensures that each resource has a distinct URL and can be used with HTTP methods for CRUD tasks. This is based on the RESTful API architecture approach.
- ## Description
- ### As admin
    - Admin can see all tweets and delete it.
    - Admin can see all users information.
- ### As user
    - User can register and signin/out the app.
    - User can post tweet.
    - User can reply the tweet.
    - User can like/unlike the tweet.
    - User can follow/unfollow the other users.
    - User can manage their own profile.
    - User can see information about a specific user, such as their own tweets/replies/likes/followers and following list.
    - User can get the top 10 users which order by amount of followers.
- ## API docs
- https://www.notion.so/API-a06c3c54e14146bdbbd8709124d450ba

- ## Installation
- ### Clone the project to local
```
git clone https://github.com/hl94vul3h6/twitter-api-2020.git
```
- ### Enter the project folder
```
cd twitter-api-2020
```
- ### Install
```
npm install
```
- ### Create .env as .env.example required
```
JWT_SECRET=<jwt_secret>
PORT=<port>
IMGUR_CLIENT_ID=<imgur_client_id>
```
### Update the config/config.json
```
"development": {
  "username": "<username>",
  "password": "<mysql_workbench_password>",
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
  }
```
- ### Create the database in MySQL
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
- ### Execute migration to create the data table
```
$ npx sequelize db:migrate
```
- ### Create the seed data
```
$ npx sequelize db:seed:all
```
- ### Run the app
```
$ npm run dev
```
When everything goes well it will show: Example app listening on port 3000!.
- ### If you want to stop the process
```
ctrl + c
```
- ## Test accounts

  | Admin | |
  |---|---|
  | Account | admin |
  | Password | 12345678 |

  | User | |
  |---|---|
  | Account | user1 |
  | Password | 12345678 |
- ## Author
- [Watson Huang] (https://github.com/hl94vul3h6)
- [Ray Chen] (https://github.com/RayYangTW)
