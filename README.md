# Simple Twitter API
這是一份Twitter協作專案，要使用前要先做以下設定。

## Initialize
### Clone the project to local
1. clone project
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

* 第一組帳號有 admin 權限：
  * email: root@example.com
  * password: 12345678
* 第二組帳號沒有 admin 權限：
  * email: user1@example.com
  * password: 12345678

### API docs