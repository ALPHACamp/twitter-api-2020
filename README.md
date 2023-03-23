# twitter-end-2020 後端框架Node.js

## Project setup
1. Clone projet to your localhost
```
git clone https://github.com/yc62897441/twitter-api-2020.git
```

2. change directory to project file
```
cd "twitter-api-2020"
```

3. install npm module
```
npm install
```

4. /routes/index.js 註解測試用的helper，改用開發時的JWT登入驗證
```
// 解開以下程式的註解
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

// 將以下測試用的helper註解起來
// const helpers = require('../_helpers')
// const authenticated = (req, res, next) => {
//   if (helpers.getUser(req)) {
//     const user = helpers.getUser(req)
//     req.user = {
//       ...req.user,
//       ...user
//     }
//     // req.body.email = 'User1'
//     // req.body.account = 'User1'
//     return next()
//   }
//   return res.status(401).json({ status: 'error' })
// }
```
![alt text](https://github.com/yc62897441/twitter-api-2020/blob/master/images/guide_pic.jpg?raw=true)

5. 建立資料表
```
npx sequelize db:migrate
```

6. 建立種子資料
```
npx sequelize db:seed:all
```

7. Run project
```
nodemon app.js
```