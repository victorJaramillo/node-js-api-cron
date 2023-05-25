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
    console.log({'DATA_BASE':`Connected_successfully`});
  }
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_LP_USER || 'root',
    password: process.env.MYSQL_LP_PASS || 'root123',
    database: process.env.DB_NAME
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

const paginate = (query, options)  => {
  var origQuery = query;
  var skipFrom, sortBy, columns;
  columns = options.columns || null;
  sortBy = options.sortBy || null;
  var pageNumber = 1;
  var resultsPerPage = 10;
  if(options.limit && !isNaN(options.limit)){
    resultsPerPage = options.limit;
  }
  if(options.page && !isNaN(options.page)){
    pageNumber = options.page;
  }

  skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  query = query + " LIMIT " + skipFrom + ", " + resultsPerPage;
  if (columns !== null) {
    query = "SELECT " + options.columns + " FROM (" + query + ") AS derivedTable ";
  }

  return new Promise(( resolve, reject ) => {
    mysqlConnection.query( query, options.params, function(err, rows, fields){
      if(err){
        return reject(err);
      } 
      //REGEX to count total results from query
      query = origQuery.replace(new RegExp("SELECT(\\s(.+,)*\\s(\\w+|\\*)\\s|\\s(\\w+|\\*)\\s)FROM"), 
          "SELECT count(*) as total FROM");
      mysqlConnection.query( query, options.params, function(err, rows2, fields){
        if(err){
          return reject(err);
        } 
        var total = rows2.length != 0 ? (undefined == rows2[0].total ? rows2.length : rows2[0].total) : 0;
        var items = rows.length;
        var pages = Math.ceil(total/items)
        var json = { 
          currentPage: Number.parseInt(pageNumber),
          totalPages: pages,
          itemsPerPage: items,
          total: total,
          results: rows
        };
        resolve(json);
      });
    });
  })
}

module.exports = {mysqlConnection, query, paginate};