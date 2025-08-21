import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee",
    port: 8889,
  });

  db.getConnection((err) => {
    if (err) {
      console.error("Database connection failed: ", err);
    } else {
      console.log("Connected to MySQL Database");
    }
  });

  export default db;


  