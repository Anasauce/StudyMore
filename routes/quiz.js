import express from 'express'
const router = express.Router()

import { Quiz, QuizCard } from '../database/db'

router.get( '/:id/:cardNumber', (request, response) => {
  const { id, cardNumber } = request.params
  const { correct, cardId } = request.query

  console.log('1st Log - card Number:' ,cardNumber);

  Quiz.getSubject( id )
    .then( subject => Promise.all([
      Promise.resolve( subject ),
      Quiz.nextQuestion( id, cardNumber ),
      QuizCard.update(correct, cardId),
      QuizCard.count(id)
    ]))
    .then( result => {
      const [ subject, card, whyIsThisNull, count ] = result

      console.log('card', card)

      console.log('2nd log - count', count)
      console.log('3rd log - cardId: ',cardId)

      let nextCard = parseInt(cardNumber) + 1
      let index = count.count

      console.log('4th log - This is index', index, 'This is nextCard', nextCard)

      if (nextCard === (index + 1)){

        Promise.all([
          QuizCard.update(correct,cardId),
          QuizCard.count(id),
          QuizCard.incorrect(id)
        ])
        .then(result => {

          console.log('5th Log -')
          console.log('1', result[0])
          console.log('2' ,result[1])
          console.log('3' ,result[2])

          const total = result[1].count
          const wrong = result[2].length

          let percentCorrect =  100 * (total - wrong) / total
          console.log('6th log - # of incorrect:', wrong, '# of questions:', total)

          response.render('results', { percentCorrect })
        })
      } else {
        response.render( 'subjects/quiz', { card, subject, id, nextCard } )
      }
    })
    .catch( error => response.send( error ))
})

module.exports = router
