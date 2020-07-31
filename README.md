# Simple Twitter (Backend)
An API server for ALPHA Camp Simple Twitter project.

👉 API Server URL 
```
https://twitter-backend-hj.herokuapp.com/
```
👉  [Frontend Project](https://github.com/blue1152/tweet-vue-2020)

👉 GitHub Pages (In Progress)

## Getting Started
1. Clone repository to your local computer
```
$ git clone https://github.com/harry811016/twitter-api-2020.git
```

2. Install by [npm](https://www.npmjs.com/)
```
$ npm install
```

3. Create **.env** file in root directory and add your PORT, IMGUR CLIENTID and JWT_SECRET
(You can apply from [imgur](https://imgur.com/))
```
PORT=3000
IMGUR_CLIENT_ID = ''
JWT_SECRET=
```

4. Make sure your DB is ready then using seed data 
```
npx sequelize db:seed:all
```
5. Execute 
```
$ npm run dev 
```
6. Terminal show the message 
 ```
Example app listening on port 3000!
```
Now you can call APIs from server 
```
http://localhost:3000
```


## Built With
* Node.js: 12.16.2
* bcryptjs: 2.4.3
* body-parser: 1.18.3
* chai: 4.2.0
* cors: 2.8.5
* dotenv: 8.2.0
* express: 4.16.4
* faker: 4.1.0
* imgur-node-api: 0.1.0
* jsonwebtoken: 8.5.1
* method-override": 3.0.0
* mocha: 6.0.2
* moment: 2.27.0
* multer: 1.4.2
* mysql2: 1.6.4
* passport: 0.4.1
* passport-jwt: 4.0.0
* pg: 8.3.0
* sequelize: 5.8.6
* sequelize-cli: 5.5.0
* sinon: 7.2.3
* sinon-chai: 3.3.0

## Author
Harry Lu、[Justin Huang 黃士庭](https://www.linkedin.com/in/justinhuang777/) 
