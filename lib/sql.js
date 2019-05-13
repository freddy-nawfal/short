const mysql = require('mysql');

const connection = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "short"

});

module.exports.storeUrl = function (url, shortUrl, callback) {

    connection.query("INSERT INTO url ( url, short_url, timestamp ) VALUES ( " + connection.escape(url) + "," + connection.escape(shortUrl) + ", now() )", function (err, result) {

        if (err) throw err;

        callback(result.affectedRows > 0);

    });

}

module.exports.selectUrl = function (shortUrl, callback) {

    connection.query("SELECT * FROM url WHERE short_url = "+connection.escape(shortUrl), function (err, result) {

        if (err) throw err;

        callback(result);

    });

}
