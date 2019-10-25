const util = require("util");
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "todo",
    password: ""
});

pool.getConnection((err, conn) => {
    if (err) throw err;
    if (conn)
        console.log("database is connected successfully...");
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;