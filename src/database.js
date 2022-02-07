const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_LP_USER || 'root',
    password: process.env.MYSQL_LP_PASS || 'root123',
    database: process.env.DB_NAME
});

// Configurations [Data base]
mysqlConnection.connect((error) => {
    if (error) {
        console.log(process.env);
        throw error;
    } else {
        console.log(`Connected to database`);
    }
});

module.exports = mysqlConnection;