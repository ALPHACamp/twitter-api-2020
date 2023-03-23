# Simple Twitter API
這是一份Twitter協作專案，要使用前要先做以下設定。

## Initialize
### Clone the project to local
```
git clone https://github.com/kai3kai2/twitter-api-2020.git
```

### Initialize
```
npm install
```

### Add .env file
```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
IMGUR_CLIENT_SECRET=SKIP
```

### add your password and username of your MySQL workbench to config/config.json
```
"development": {
    "username": "<your username>",
    "password": "<your password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```

### Create the database
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

### Create the data table
```
npx sequelize db:migrate
```

### Create the seed data
```
npx sequelize db:seed:all
```

### Run the service
```
npm run dev
```

### Test accounts
* This account have admin permission：
  * email: root@example.com
  * password: 12345678
* This account does not have admin permission：
  * email: user1@example.com
  * password: 12345678

### API docs
```
https://psychedelic-mine-4a0.notion.site/Twitter-API-3e2fc44b290f4108a2063e45d16fce75
```