const connection = require('./db');

connection.connect();

connection.query('',(err, result, field)=>{

})

connection.end();