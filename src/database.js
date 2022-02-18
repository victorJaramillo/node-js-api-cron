const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_LP_USER || 'root',
    password: process.env.MYSQL_LP_PASS || 'root123',
    database: process.env.DB_NAME
});

const pool = mysql.createPool({
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


let query = function( sql, values ) {
    // devolver una promesa
 return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
     if (err) {
       reject( err )
     } else {
       connection.query(sql, values, ( err, rows) => {

         if ( err ) {
           reject( err )
         } else {
           resolve( rows )
         }
         connection.release()
       })
     }
   })
 })
}

module.exports = {mysqlConnection, query};