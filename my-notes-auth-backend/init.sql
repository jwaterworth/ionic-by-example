CREATE TABLE user (id TEXT PRIMARY KEY, name TEXT, password TEXT);
CREATE TABLE note (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, description TEXT);
CREATE INDEX idx_note_user ON note(user_id);

INSERT INTO user (id, name, password) VALUES ('alice', 'Alice', 'alice123');
INSERT INTO note (id, user_id, title, description) VALUES ('000001', 'alice', 'First Note', 'Alice''s first note.');
INSERT INTO note (id, user_id, title, description) VALUES ('000002', 'alice', 'Second Note', 'Alice''s second note.');

INSERT INTO user (id, name, password) VALUES ('bob', 'Bob', 'bob123');
INSERT INTO note (id, user_id, title, description) VALUES ('000003', 'bob', 'First Note', 'Bob''s first note.');
INSERT INTO note (id, user_id, title, description) VALUES ('000004', 'bob', 'Second Note', 'Bob''s second note.');
