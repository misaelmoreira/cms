mysql = require('mysql');
connectionString = 'mysql://root:1234@localhost:3406/cms-api';

db = {};
db.cnn = {};
db.cnn.exec = function(query, callback){
    var connection = mysql.createConnection(connectionString);
    connection.query(query, function(err, rows){
        callback(rows, err);
        connection.end();
    });
};

module.exports = db;