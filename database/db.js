import pgPromise from 'pg-promise'
const pgp = pgPromise()
const db = pgp({ database: 'flashcardDB' })

const findUserById = 'SELECT * FROM users WHERE id=$1'
const findByLogin = 'SELECT * FROM users WHERE email=$1 AND password=$2'
const createUser = 'INSERT INTO users( name, email, password ) VALUES ( $1, $2, $3 ) RETURNING id'

const findSubjectById = 'SELECT * FROM subjects WHERE user_id=$1'
const findBySubjectId = 'SELECT * FROM subjects WHERE id = $1'
const insertSubject = 'INSERT INTO subjects( title, user_id ) VALUES( $1, $2 ) RETURNING id'
const updateSubject = 'UPDATE subjects SET title = $1 WHERE id = $2 RETURNING id'
const deleteSubject = 'DELETE FROM subjects WHERE id = $1'

const createCard = 'INSERT INTO cards(front, back, subject_id) VALUES ($1, $2, $3) RETURNING id'
const findCardBySubjectId = 'SELECT * FROM cards WHERE subject_id=$1'
const deleteCard = 'DELETE FROM cards WHERE id = $1'
const updateCard = 'UPDATE cards SET front = $1, back = $2, subject_id = $3 WHERE id = $4'
const findById = 'SELECT * FROM cards WHERE id = $1'
const findCards = 'SELECT cards.*, subject_id FROM cards WHERE subject_id IN ($1:csv)'

const createQuiz = 'INSERT INTO quizzes( user_id, subject_id ) VALUES ( $1, $2 ) RETURNING id'
const addCardToQuiz = 'INSERT INTO quiz_cards( quiz_id, card_id ) VALUES ( $1, $2 )'
const nextQuestion = 'SELECT cards.* FROM quiz_cards JOIN cards ON cards.id=quiz_cards.card_id WHERE quiz_id=$1 LIMIT 1 OFFSET $2'
const getQuizSubject = 'SELECT subjects.* FROM quizzes JOIN subjects ON quizzes.subject_id=subjects.id WHERE quizzes.id=$1'

const isCorrect = 'UPDATE quiz_cards SET correct=$1 WHERE card_id=$2'
const count = `SELECT COUNT(*) FROM quiz_cards WHERE id=$!`

const User = {
  findById: id => db.one( findUserById, [id] ),
  find: (email, password) => db.any( findByLogin, [email, password] ),
  signUp: (name, email, password) => db.one( createUser, [name, email, password])
}

const Subject = {
  update: ( title, id ) => db.one( updateSubject, [ title, id ] ),
  create: ( title, id ) => db.one( insertSubject, [ title, id ]),
  findById: user_id => db.any( findSubjectById, [user_id]),
  find: id => db.one( findBySubjectId, [ id ] ),
  delete: id => db.none( deleteSubject, [ id ] )
}

const Card = {
  create: (front, back, subject_id) => db.one(createCard, [front, back, subject_id]),
  findBySubjectId: id => db.any( findCardBySubjectId, [id]),
  delete: id => db.none( deleteCard, [id]),
  update: ( front, back, subject_id, id ) => {
    return db.none( updateCard, [ front, back, subject_id , id ])
  },
  find: id => db.one( findById, [ id ] ),
  findCardsBySubjectIds: subjectIds => db.manyOrNone( findCards, [ subjectIds ])
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

const QuizCard = {
  update: (correct, cardId) => {
    return db.none(isCorrect, [correct, cardId])
  },
  length: id => {
    return db.one(count, [id])

  }
}

export { User, Subject, Card, Quiz, QuizCard}
