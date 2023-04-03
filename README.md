# twitter-api

This is an API developed for Simple Twitter, using nodejs and MySQL database to create a server. It utilizes passport.js and jwt for identity management and squelize ORM to manipulate the database. It provides Simple Twitter users with access to user data, tweet data, reply data, follow relationships, like records, and administrator data management on the front end.

| Error Class  | HTTP Status Code | Description                                               |
| ------------ | ---------------- | --------------------------------------------------------- |
| ReqError     | 400              | Indicates a bad request                                   |
| AuthError    | 401              | Indicates that the client is unauthenticated to access a resource |
| AutherError  | 403              | Indicates that the client is forbidden from accessing a resource |
| RouteError   | 404              | Indicates that the requested resource is not found on the server |
| -            | 200              | Indicates that the request was successful                 |

You can access the API through the following URLs that have been deployed on Heroku: https://twitter-api-03.herokuapp.com/ and https://secret-caverns-10798.herokuapp.com/. If you experience any errors, it may be because of a post limitation from Heroku. In such a situation, we suggest using the alternative URL: https://secret-caverns-10798.herokuapp.com/.

If you have any questions, please contact the developers, [小江](https://github.com/sd880428) and [TH](https://github.com/thk61159).

see our [API Doc](https://documenter.getpostman.com/view/25669324/2s93RUvXoN)

see our [front-end website](https://thk61159.github.io/ToughTwitter/)

seeder帳號:
| account  | password | role|
| ------------ | ---------------- | --------------------------------------------------------- |
| root    | 12345678              |admin 
| user1    | 12345678              |user
| ...    | ...              |...
| user5    | 12345678              |user

## 環境:
+ 程式編輯器: [Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/ "Visual Studio Code") 
+ 使用框架: [express](https://www.npmjs.com/package/express)@4.16.4
---
## 安裝與執行:
1. clone此專案
```
git clone https://github.com/sd880428/twitter-api-2020.git
```

2. 使用終端機到此專案目錄下
```
cd ~/.../twitter-api-2020/
```
3. 安裝套件
```
npm i
```
4. 自行加入.env 檔(參考.env.example)

5. 建立資料庫
```
npx sequelize db:create
```
6. 匯入model與seeder
```
npm run migrate & npm run seed
```
7. 執行(windows)
```
npm run dev
```
7. 執行(mac)
```
npm run devMac
```
如成功終端機會顯示:[Example app listening on port 4000!]

8. 顯示成功訊息後即可使用api

