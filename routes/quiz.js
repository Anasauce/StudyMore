import express from 'express'
const router = express.Router()

import { Quiz, QuizCard } from '../database/db'

router.get( '/:id/:cardNumber', (request, response) => {
  const { id, cardNumber } = request.params
  const { correct, cardId } = request.query

  Quiz.getSubject( id )
    .then( subject => Promise.all([
      Promise.resolve( subject ),
      Quiz.nextQuestion( id, cardNumber ),
      QuizCard.update(correct, cardId),
      QuizCard.count(id)
    ]))
    .then( result => {
      const [ subject, card, whyIsThisNull, count ] = result
      let nextCard = parseInt(cardNumber) + 1
      let index = count.count

      if(cardNumber === index) {
        Promise.all([ QuizCard.incorrect(id) ])
          .then(result => {
            const [ incorrect ] = result
            const percentCorrect =  Math.floor(100 * (index - incorrect.length) / index)

            response.render('results', { percentCorrect })
          })
      } else {
        response.render( 'subjects/quiz', { card, subject, id, nextCard } )
      }
    })
    .catch( error => response.send( error ))
})

module.exports = router
