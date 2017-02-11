'use strict';
var crypto = require('crypto');
var sqlite3 = require('sqlite3');

function create(dbFile) {
  var db = new sqlite3.Database(dbFile);

  var listStmt = db.prepare('SELECT id, title, description FROM note WHERE user_id = $userId');
  var getStmt = db.prepare('SELECT id, title, description FROM note WHERE id = $noteId AND user_id = $userId');
  var createStmt = db.prepare('INSERT INTO note (id, user_id, title, description) VALUES ($noteId, $userId, $title, $description)');
  var updateStmt = db.prepare('UPDATE note SET title = $title, description = $description WHERE id = $noteId AND user_id = $userId');
  var deleteStmt = db.prepare('DELETE FROM note WHERE id = $noteId AND user_id = $userId');

  return {
    list: function(userId, callback) {
      listStmt.all({$userId: userId}, callback);
    },
    get: function(userId, noteId, callback) {
      getStmt.get({$userId: userId, $noteId: noteId}, callback);
    },
    create: function(userId, note, callback) {
      var noteId = crypto.randomBytes(4).toString('hex');
      var params = {$userId: userId, $noteId: noteId, $title: note.title, $description: note.description};
      return createStmt.run(params, function(error) {
        callback(error, noteId);
      });
    },
    update: function(userId, note, callback) {
      var params = {$userId: userId,$noteId: note.id, $title: note.title, $description: note.description};
      updateStmt.run(params, function(error) {
        callback(error, this.changes === 1);
      });
    },
    remove: function(userId, noteId, callback) {
      deleteStmt.run({$userId: userId, $noteId: noteId}, function(error) {
        callback(error, this.changes === 1);
      });
    }
  };
}

exports.create = create;
