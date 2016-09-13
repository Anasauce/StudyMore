import pgPromise from 'pg-promise'
const pgp = pgPromise()
const db = pgp({ database: 'flashcardDB' })

const findUserById = 'SELECT * FROM users WHERE id=$1'
const findByLogin = 'SELECT * FROM users WHERE email=$1 AND password=$2'
const createUser = 'INSERT INTO users( name, email, password ) VALUES ( $1, $2, $3 ) RETURNING id'

const findSubjectById = 'SELECT * FROM subjects WHERE user_id=$1'
const findBySubjectId = 'SELECT * FROM subjects WHERE id=$1'
const insertSubject = 'INSERT INTO subjects( title, user_id ) VALUES( $1, $2 ) RETURNING id'

const createCard = 'INSERT INTO cards(front, back, subject_id) VALUES ($1, $2, $3) RETURNING id'
const findCardBySubjectId = 'SELECT * FROM cards WHERE subject_id=$1'

const createQuiz = 'INSERT INTO quizzes( user_id, subject_id ) VALUES ( $1, $2 ) RETURNING id'
const addCardToQuiz = 'INSERT INTO quiz_cards( quiz_id, card_id ) VALUES ( $1, $2 )'
const nextQuestion = 'SELECT cards.* FROM quiz_cards JOIN cards ON cards.id=quiz_cards.card_id WHERE quiz_id=$1 LIMIT 1 OFFSET $2'
const getQuizSubject = 'SELECT subjects.* FROM quizzes JOIN subjects ON quizzes.subject_id=subjects.id WHERE quizzes.id=$1'

const User = {
  findById: id => db.one( findUserById, [id] ),
  find: (email, password) => db.any( findByLogin, [email, password] ),
  signUp: (name, email, password) => db.one( createUser, [name, email, password])
}

const Subject = {
  create: ( title, id ) => db.one( insertSubject, [ title, id ]),
  findById: user_id => db.any( findSubjectById, [user_id]),
  find: id => db.one( findBySubjectId, [id] )
}

const Card = {
  create: (front, back, subject_id) => db.one(createCard, [front, back, subject_id]),
  findBySubjectId: id => db.any( findCardBySubjectId, [id])
}

const Quiz = {
  create: ( user_id, subject_id ) => {
    return db.one( createQuiz, [user_id, subject_id ])
      .then( quizId => Promise.all([
        Promise.resolve( quizId.id ),
        Card.findBySubjectId( subject_id )
      ]))
      .then( result => {
        const [ quizId, cards ] = result

        return Promise.all([
          Promise.resolve( quizId ),
          ...cards.map( card => db.none( addCardToQuiz, [quizId, card.id] ))
        ])
      })
  },
  getSubject: id => db.one( getQuizSubject, [id] ),
  nextQuestion: (quizId, cardNumber) => db.one( nextQuestion, [quizId, cardNumber] )
}

export { User, Subject, Card, Quiz }
