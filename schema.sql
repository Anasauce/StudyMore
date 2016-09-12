
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS quizes;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS quiz_cards;

CREATE TABLE quiz_cards
(
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL,
  rank INTEGER NOT NULL,  
  correct BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS quizes;
CREATE TABLE quizes
(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS subjects;
CREATE TABLE subjects
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS cards;
CREATE TABLE cards
(
  id SERIAL PRIMARY KEY,
  front VARCHAR(255) NOT NULL,
  back VARCHAR(255) NOT NULL,
  subject_id INTEGER NOT NULL
);


DROP TABLE IF EXISTS users;
CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);