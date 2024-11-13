var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('login'); 
});

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/", function(err, client){
  if (err) throw err;
  var db = client.db('MyDB');
  console.log('Hi');
  db.collection('Users').insertOne({id:1, firstName: 'Youssef', lastName: 'Hesham'});
})

app.listen(3000);