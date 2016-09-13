import express from 'express'
const router = express.Router()

import { Quiz } from '../database/db'

router.get( '/:id/:cardNumber', (request, response) => {
  const { id, cardNumber } = request.params
  // TODO: Use this info to update the quiz card
  const { correct, currentId } = request.query

  Quiz.getSubject( id )
    .then( subject => Promise.all([
      Promise.resolve( subject ),
      Quiz.nextQuestion( id, cardNumber )
    ]))
    .then( result => {
      const [ subject, card ] = result

      // TODO: Check and see if last card
      response.render( 'subjects/quiz', { card, subject, id, nextCard: parseInt( cardNumber ) + 1 } )
    })
    .catch( error => response.send( error ))
})

module.exports = router
