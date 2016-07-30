/**
 * Created by David on 30/07/2016.
 */
var express = require("express");
var bodyParser = require('body-parser');    // allows use to grab form data
var path = require('path');     
var app = express();
var nunjucks = require('nunjucks');



app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'nunjucks');
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');


nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
    res.render('index.html');
});

// app.listen(port_no, call_back_function(){};
app.listen(3000, function () {
    console.log('Server started on port 3000');
});