const mysql = require('mysql');

const connect = mysql.createConnection({
    host: '103.97.125.254',
    port: 3306,
    user: 'scawwomg_admin',
    password: 'khanh1711',
    database: 'scawwomg_ttb'
})

setInterval(()=>{
    connect.query('SELECT version()');
},5000);

module.exports = connect;