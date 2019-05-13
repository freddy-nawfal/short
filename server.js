const express = require('express');
const shortId = require('shortid');
const validUrl = require('valid-url');
const path = require('path');
const flash = require('connect-flash');
const sql = require('./lib/sql');
const session = require('express-session');
const bodyParser = require('body-parser');


const server = express();

server.set('views', path.join(__dirname, 'views'));

server.set('view engine', 'hbs');

server.use(express.static("public"));

server.use(flash());

server.use(session({

    name: 'JSESSION',

    secret: "cat",

    resave: true,

    saveUninitialized: true

}));

server.use(bodyParser.json());

server.use(bodyParser.urlencoded({

    extended: true

}));

server.listen(8080, () => {

    console.log('EXPRESS > Listening on port 8080.');

});


server.get('/', function (req, res) {

    res.render('index', { 'alert': req.flash('alert') });

});


server.post('/', function (req, res) {

    console.log(req.body.url);

    if (req.body.url) {

        const url = req.body.url;

        console.log(url);

        if (validUrl.isUri(url)) {

            console.log("valid");

            const shortUrl = shortId.generate();

            sql.storeUrl(url, shortUrl, function (result) {

                if (result) {

                    req.flash('alert', "Short URL Created : ntcln.me/" + shortUrl);

                    res.render('index', { 'alert': req.flash('alert') });

                } else {

                    req.flash('alert', "Please enter a valid URL");

                    res.render('index', { 'alert': req.flash('alert') });

                }

            });

        } else {

            req.flash('alert', "Please enter a valid URL");

            res.render('index', { 'alert': req.flash('alert') });

        }

    } else {

        req.flash('alert', "Please insert an URL");

        res.render('index', { 'alert': req.flash('alert') });

    }

});


server.get('/:short', function (req, res) {

    const shortUrl = req.params.short;

    sql.selectUrl(shortUrl, function (result) {

        if (result.length > 0) {

            res.redirect(result[0].url);

        } else {

            console.log("thefuckisthis");

        }

    });

});


server.use(function (req, res, next) {

    const err = new Error('Not Found');

    err.status = 404;

    next(err);

});