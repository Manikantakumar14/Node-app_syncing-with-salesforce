const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b6515ab5d034d1',
    database: 'heroku_688015b789a3131',
    password: '40c37bd7'
});

module.exports = pool.promise();