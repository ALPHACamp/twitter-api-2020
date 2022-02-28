# twitter-api-2020 README

## 初始化

### 將專案複製到本機
```
git clone https://github.com/dandywhy/twitter-api-2020.git
```

### 安裝相關套件
```
npm install
```

### 新增個人的環境設定
```
cp .env.example .env
```

```
vi .env
```
設定JWT_SECRET=alphacamp

### 建立資料庫
```
npx sequelize db:migrate
```

若要刪除全部資料庫
```
npx sequelize db:migrate:undo:all
```

### 建立種子資料
```
npx sequelize db:seed:all
```

若要刪除全部種子資料
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

## 共用帳號
下面 2 組帳號為測試帳號：
* 第一組帳號有 admin 權限：
  * email: root@example.com
  * password: 12345678
* 第二組帳號沒有 admin 權限：
  * email: user1@example.com
  * password: 12345678
