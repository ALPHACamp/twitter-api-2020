# Twitter API

## Get Started
### Environment
* Node.js 16.17.0
* MySQL
### Installation
1. Clone the project to local
```bash
git clone https://github.com/ping8601/twitter-api/
```
2. Install all the needed packages
```bash
npm install
```
3. Add a file .env in the project folder and add required environment variables mentioned in .env.example
4. Create a MySQL data base with the name ac_twitter_workspace
5. Update the username and password information in the file config/config.json according to your database
```bash
"development": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```
6. Create the data tables in the database
```bash
npx sequelize db:migrate
```
7. Add seed data into the database
8. Create the data tables in the database
```bash
npx sequelize db:seed:all
```
9. Start the server
```bash
npm run dev
```
10. If you see this message, the server is successfully started
```bash
Example app listening on port 3000!
```
11. Open your brower and enter the link http://localhost:3000 to start exploring the website!
12. Use the test accounts to login or register your own acocunt.
```bash
`Admin`
account: root
password: 12345678

`User`
account: user1
password: 12345678
--------------------------
account: user2
password: 12345678
--------------------------
account: user3
password: 12345678
--------------------------
account: user4
password: 12345678
--------------------------
account: user5
password: 12345678
--------------------------
```
13. Press control + c to end the server

## API Documents
https://www.notion.so/Backend-API-09f30c304d2b4e3086c16f28b245093c

## Collaborator
* Elena Hung @ping8601
* Verna @Verna0214
