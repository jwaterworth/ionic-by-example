Notes API
=========

This is a simple Express/Node.js server application that provides a Notes API.

For documentation, sample requests and responses for all supported operations are provided below.

Authenticate
------------

Request:

    POST /authenticate
    Content-Type: application/json

    {
      "user": "alice",
      "password": "alice"
    }

Response:

    200 OK
    Content-Type: application/json

    {
      "token": "some.auth.token"
    }

List Notes
----------

Request:

    GET /notes/
    Authorization: Bearer some.auth.token

Response:

    200 OK
    Content-Type: application/json

    [
      {
        "id": "000001",
        "title": "First Note",
        "description": "This is the first note."
      },
      {
        "id": "000002",
        "title": "Second Note",
        "description": "This is the second note."
      }
    ]

Read Note
---------

Request:

    GET /notes/000001
    Authorization: Bearer some.auth.token

Response:

    200 OK
    Content-Type: application/json

    {
      "id": "000001",
      "title": "First Note",
      "description": "This is the first note."
    }

Create Note
-----------

Request:

    POST /notes/
    Authorization: Bearer some.auth.token
    Content-Type: application/json

    {
      "title": "New Note",
      "description": "This is a new note."
    }

Response:

    201 Created
    Location: /notes/abc123

The request must not contain a note id. The id is assigned by the server and returned in the Location header.

Update Note
-----------

Request:

    PUT /notes/000001
    Authorization: Bearer some.auth.token
    Content-Type: application/json

    {
      "id": "000001",
      "title": "First Note",
      "description": "This is the first note, modified."
    }

Response:

    204 No Content

Delete Note
-----------

Request:

    DELETE /notes/000002
    Authorization: Bearer some.auth.token

Response:

    204 No Content
