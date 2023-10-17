const { Pool } = require("pg");
const config = require("./index");
const { Sequelize } = require("sequelize");
const pool = new Pool({
  user: config.postgresUser,
  password: config.postgresPassword,
  host: "localhost",
  database: "proreplaydb",
  port: 5432,
});
const sequelize = new Sequelize(
  "proreplaydb",
  config.postgresUser,
  config.postgresPassword,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

const connectDB = () => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error("Error acquiring client", err.stack);
    }
    console.log("connected to database");
    client.query("SELECT NOW()", (err, result) => {
      release();
      if (err) {
        s;
        return console.error("Error executing query", err.stack);
      }
      console.log(result.rows);
    });
  });
};
module.exports = { connectDB, pool, sequelize };
