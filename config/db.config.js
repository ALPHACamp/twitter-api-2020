module.exports = {
  HOST: process.env.RDS_HOSTNAME,
  USER: process.env.RDS_USERNAME,
  PASSWORD: process.env.RDS_PASSWORD,
  DB: 'database-1',
  PORT: process.env.RDS_PORT,
  dialect: "mysql",
};