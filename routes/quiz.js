import express from 'express'
const router = express.Router()

import { Quiz, QuizCard } from '../database/db'

router.get( '/:id/:cardNumber', (request, response) => {
  const { id, cardNumber } = request.params
  // TODO: Use this info to update the quiz card this <--- DONE!!!
  const { correct, cardId } = request.query


  Quiz.getSubject( id )
    .then( subject => Promise.all([
      Promise.resolve( subject ),
      Quiz.nextQuestion( id, cardNumber ),
      QuizCard.update(correct, cardId)
    ]))
    .then( result => {
      const [ subject, card ] = result

      //TODO stop looking for new cards when you reach the end of the deck
      // let counter = 0
      // while counter < QuizCard.length(id)
      QuizCard.length(id).then(result => console.log(result) )
      response.render( 'subjects/quiz', { card, subject, id, nextCard: parseInt( cardNumber ) + 1 } )
    })
    .catch( error => response.send( error ))
})

module.exports = router
