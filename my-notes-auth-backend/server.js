'use strict';
var express = require('express');
var expressJwt = require('express-jwt');
var unless = require('express-unless');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var notestore = require('./notestore');

var JWT_SECRET = 'top-secret';
var NOTES_DB = 'data/notes.db';

var NoteStore = notestore.create(NOTES_DB);

var app = express();
app.set('etag', false);
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: ['/authenticate'] }));

app.post('/authenticate', function (request, response) {
  var user = request.body.user;
  var password = request.body.password;
  if (user && user === password) {
    response.json({
      token: jwt.sign({}, 'top-secret', { subject: user })
    });
  } else {
    response.sendStatus(401);
  }
});

function sendError(response, error) {
  console.error(error);
  response.status(500).send('Internal Server Error');
}

app.get('/notes/', function (request, response) {
  NoteStore.list(request.user.sub, function (error, notes) {
    if (error) {
      sendError(error);
    } else {
      response.json(notes);
    }
  });
});

app.get('/notes/:noteId', function (request, response) {
  NoteStore.get(request.user.sub, request.params.noteId, function (error, note) {
    if (error) {
      sendError(error);
    } else if (note) {
      response.json(note);
    } else {
      response.status(404).send('No such note: ' + request.params.noteId);
    }
  });
});

app.post('/notes/', function (request, response) {
  NoteStore.create(request.user.sub, request.body, function (error, noteId) {
    if (error) {
      sendError(response, error);
    } else {
      response.set('Location', '/notes/' + noteId);
      response.status(201).send();
    }
  });
});

app.put('/notes/:noteId', function (request, response) {
  if (request.params.noteId !== request.body.id) {
    response.status(400).send('URL does not match request body');
  }
  NoteStore.update(request.user.sub, request.body, function (error, updated) {
    if (error) {
      sendError(response, error);
    } else if (updated) {
      response.status(204).send();
    } else {
      response.status(404).send('No such note: ' + request.params.noteId);
    }
  });
});

app.delete('/notes/:noteId', function (request, response) {
  NoteStore.remove(request.user.sub, request.params.noteId, function (error, deleted) {
    if (error) {
      sendError(response, error);
    } else if (deleted) {
      response.status(204).send();
    } else {
      response.status(404).send('No such note: ' + request.params.noteId);
    }
  });
});

var server = app.listen(8200, function () {
  console.log('Notes API listening at http://localhost:8200');
});
