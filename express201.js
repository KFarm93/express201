const express = require('express');
const myApp = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const marked = require('marked');
const _ = require('lodash');

var token = "";

function user(username, userToken) {
  this.username = username;
  this.token = userToken;
}

var kevin = new user("kfarm", "11.4.5.2.8.12.1.3.9.7.6.10");
var jeff = new user('bceagle87', "3.12.5.8.11.2.10.4.9.6.7.1");

myApp.set('view engine', 'hbs');

// app.use(express.static('public'));
myApp.use(bodyParser.json());

myApp.use(function myMiddleWare(request, response, next) {
  fs.appendFile('log.md', request.method + request.path, function(err) {
  });
  next();
});

function auth(req, res, next) {
  if (req.query.token === token) {
    next();
  }
  else {
    res.json({ message: "Nope!", token: token});
  }
}

myApp.put('/documents/:filepath', auth, function(req, res) {
  let filepath = './data/' + req.params.filepath + '.md';
  let contents = req.body.contents;
  fs.writeFile(filepath, contents, function(err) {
    if (err) {
      res.json({ message: err.message});
    }
    else {
      res.json({ message: 'File' + filepath + 'saved.'});
    }
  });
});

myApp.get('/documents/:filepath', auth, function(req, res) {
  let filepath = './data/' + req.params.filepath + '.md';
  fs.readFile(filepath, function(error, buffer) {
    if (error) {
      res.json({ message: "ya dun goofed: " + error.message});
    }
    else {
      res.json({ filepath: filepath, contents: buffer.toString(), token: token});
    }
  });
});

myApp.get('/documents/:filepath/display', auth, function(req, res) {
  let filepath = './data/' + req.params.filepath + '.md';
  let contents = fs.readFile(filepath, function(error, buffer) {
    if (error) {
      console.log("ya dun goofed: " + error.message);
    }
    else {
      var theContent = marked(buffer.toString());
      res.render('display.hbs', {
        title: filepath,
        contents: theContent
      });
    }
  });
});

myApp.get('/documents', auth, function(req, res) {
  fs.readdir('./data', function(err, entries) {
    if (err) {
      res.status(500);
      res.json({ error: err.message});
    }
    else {
      res.json(entries);
    }
  });
});

myApp.delete('/documents/:filepath', auth, function(req, res) {
  var filepath = req.params.filepath;
  fs.unlink('./data/' + filepath, function(err) {
    if (err) {
      res.status(500);
      res.json({ error: err.message });
    } else {
      res.json({ status: 'ok' });
    }
  });
});

myApp.post('/api/login', function(req, res) {
  if (req.query.username === "kfarm") {
    token = kevin.token;
    res.json({ message: "Kevin logged in!", token: token});
  }
  else if (req.query.username === "bceagle87") {
    token = jeff.token;
    res.json({ message: "Jeff logged in!", token: token});
  }
  else {
    res.json({ message: "Didn't work."});
  }
});

myApp.listen(3000, function () {
  console.log('Example app listening on port 3000');
});
