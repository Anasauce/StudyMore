import express from 'express'
const router = express.Router()

import { Quiz, QuizCard } from '../database/db'

router.get( '/:id/:cardNumber', (request, response) => {
  const { id, cardNumber } = request.params
  const { correct, cardId } = request.query

  console.log( 'these re ids', id, cardNumber )

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
        const cardIDs =[]
        Promise.all([ QuizCard.incorrect(id) ])
          .then(result => {
            const incorrect = result[0]
            const wrongCards = incorrect.forEach(item => {
              cardIDs.push(item.card_id)
            })
            const  cIDs = cardIDs.toString()
            const wrongIDs = cIDs.replace(/,/g , '_')
            const percentCorrect =  Math.floor(100 * (index - incorrect.length) / index)
            ;
              response.render('results', { percentCorrect, subject, wrongIDs , id })
            })
      } else {
        response.render( 'subjects/quiz', { card, subject, id, nextCard } )
      }
    })
    .catch( error => response.send( error ))
})

router.get( '/wrong/:subject_id/:cardIDs', (request, response) => {
    const {subject_id, cardIDs} = request.params
    const user_id = request.user.id
    const incorrect = cardIDs.split("_")
    Quiz.createFromExtant( user_id, subject_id, incorrect)
    .then(result => {
      response.redirect(`/quiz/${result[0]}/0`)
    })
})

module.exports = router
