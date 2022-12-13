# Simple Twitter API

本專案提供API給[AC Simple Twitter](https://github.com/JamieLoLo/ac-simple-twitter)使用。

## 安裝流程
此安裝流程為本地端(local)使用。

### 專案建立
請先確認有安裝 node.js 與 npm

1. 打開你的終端機(terminal)，Clone 此專案至本機電腦

```
git clone https://github.com/SimonHung8/twitter-api-2020.git
```

2. 進入至專案資料夾

```
cd twitter-api-2020
```

3. 安裝 npm 相關套件

```
npm install
```

4. 新增 .env
為了確保使用順利，請新增.env檔，並按照.env.example檔設定
```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
```

5. 建立MySQL資料庫
請打開MySQL Workbench，並在登入後，新增SQL File後，於內文輸入

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```

即建立ac_twitter_workspace、ac_twitter_workspace_test。

6. 建立資料庫table

```
npx sequelize db:migrate
```

7. 載入種子資料

```
npx sequelize db:seed:all
```

8. 啟動專案

```
node app.js
```

10. 當終端機(terminal)出現以下字樣，代表執行成功

```
Example app listening on port 3000.
```

### 自動化測試

- 進行全部自動化測試，將測試Model、Request
```
NODE_ENV=test
npm run test
```
- 進行單一自動化測試，將測試選擇的檔案
```
NODE_ENV=test
npx mocha test/{{ Model or Request }}/{{Model or Request}}.spec.js --exit
```

## 產品功能
- 使用者能註冊/登入帳戶
- 使用者能新增推文
- 使用者能進行互動(回覆、追蹤、喜歡、查看top追蹤用戶)
- 後臺管理者可以瀏覽全站的 Tweet 清單、刪除推文
- 後臺管理者可以瀏覽站內所有的使用者清單

## API文件
[API文件](https://www.notion.so/API-c33257dbaed64b4683fa6e8c04dc5b65)

## 開發人員
[SimonHung8](https://github.com/SimonHung8)
[OneZero](https://github.com/OneZerocococo)
