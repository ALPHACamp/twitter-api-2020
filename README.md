# simple-twitter API
這是一個簡單的推特API專案，後臺使用者可以看見站內所有使用者與推文清單，一般使用者可以對其他使用者進行追蹤，或發文、對推文回覆或按喜歡，若想串接此API的使用者請參照以下步驟。

## 初始化

### 將專案複製到本機
```
git clone https://github.com/dandywhy/twitter-api-2020.git
```

### 安裝相關套件
```
cd twitter-api-2020.git
npm install
```

### 新增個人的環境設定
```
cp .env.example .env
vi .env
```

修改以下資訊
```
PORT=3000 // Port號
IMGUR_CLIENT_ID=SKIP //圖片圖床 imgur 請至imgur申請
JWT_SECRET=SKIP 
SESSION_SECRET=SKIP
```
shift + :wq 存檔離開

### 建立資料庫

建立MySQL資料庫，需與config/config.json中的development和test的database名字一致
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

資料庫內新增資料表(Table) 與關聯
```
npx sequelize db:migrate
```

若要刪除全部資料表 (!!!有必要再進行)
```
npx sequelize db:migrate:undo:all
```

### 建立種子資料
```
npx sequelize db:seed:all
```

若要刪除全部種子資料 (!!!有必要再進行)
```
npx sequelize db:seed:undo:all
```

### 啟動本機端伺服器
```
npm run dev
```

## 遠端若有更新，要拉到本地端時
```
git pull
```

## API文件
https://zigzag-cress-7d0.notion.site/Simple-Twitter-API-fc3f66287dc1428dbb83d17af0125e6d  
以RESTful風格設計http動作與相關路由  

## 共用帳號
下面 2 組帳號為測試帳號：
* 第一組帳號有 admin 權限：
  * email: root@example.com
  * password: 12345678
* 第二組帳號沒有 admin 權限：
  * email: user1@example.com
  * password: 12345678

## 作者
Wendy (wendyog@gmail.com)  
Dandy
