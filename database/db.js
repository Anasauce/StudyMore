import pgPromise from 'pg-promise'
const pgp = pgPromise()
const db = pgp({
  database: 'flashcardDB'
})


const findUserById = 'SELECT * FROM users WHERE id=$1'
const findByLogin = 'SELECT * FROM users WHERE email=$1 AND password=$2'
const createUser = 'INSERT INTO users( name, email, password ) VALUES ( $1, $2, $3 ) RETURNING id'

const User = {
  findById: id => db.one( findUserById, [id] ),
  find: (email, password) => db.any( findByLogin, [email, password] ),
  signUp: (name, email, password) => db.one( createUser, [name, email, password])
}

export { User }
