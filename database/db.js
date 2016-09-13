import pgPromise from 'pg-promise'
const pgp = pgPromise()
const db = pgp({
  database: 'flashcardDB'
})


const findUserById = 'SELECT * FROM users WHERE id=$1'
const findByLogin = 'SELECT * FROM users WHERE email=$1 AND password=$2'
const createUser = 'INSERT INTO users( name, email, password ) VALUES ( $1, $2, $3 ) RETURNING id'
const findSubjectById = 'SELECT * FROM subjects WHERE user_id=$1'
const createCard = 'INSERT INTO cards(front, back, subject_id) VALUES ($1, $2, $3) RETURNING id'
const findBySubjectId = 'SELECT * FROM subjects WHERE id=$1'
const findCardBySubjectId = 'SELECT * FROM cards WHERE id=$1'

const User = {
  findById: id => db.one( findUserById, [id] ),
  find: (email, password) => db.any( findByLogin, [email, password] ),
  signUp: (name, email, password) => db.one( createUser, [name, email, password])
}

const insertSubject = 'INSERT INTO subjects( title, user_id ) VALUES( $1, $2 ) RETURNING id'

const Subject = {
  create: ( title, id ) => db.one( insertSubject, [ title, id ]),
  findById: user_id => db.any( findSubjectById, [user_id]),
  find: id => db.one( findBySubjectId, [id] )
}

const Card = {
  create: (front, back, subject_id) => db.one(createCard, [front, back, subject_id]),
  findBySubjectId: id => db.any( findCardBySubjectId, [id])
}

export { User, Subject, Card }
