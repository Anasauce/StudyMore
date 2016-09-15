import express from 'express'
import { Subject, Card } from '../database/db'
const router = express.Router()

router.get('/new', (request, response, next) => {
  const {id} = request.user

  Subject.findById(id)
    .then(subject => {
      response.render('create_card', { subject })
    }).catch(error => {
      response.send({message: error.message})
    })
})

router.post('/create_card', ( request, response ) => {
  const {id, front, back} = request.body

  Card.create(front, back, id)
    .then(result => {
      response.redirect(`/subjects/${id}`)
    })
})

router.get('/delete/:card_id/:subject_id', (request, response) => {
  const { card_id, subject_id } = request.params

  console.log( 'Param Values', card_id, subject_id )

  Card.delete( card_id )
    .then( () => {
      response.redirect(`/subjects/${subject_id}`)
    })
    .catch(error => {
      messege: error.messege
    })
})

router.get('/edit/:card_id', (request, response) => {
  const { card_id } = request.params
  const user_id = request.user.id

  Promise.all( [ Card.find( card_id ), Subject.findById( user_id )] )
    .then( results => {
      const [ card, subjects ] = results

      Promise.all( [ Subject.find( card.subject_id ) ] )
        .then( result => { 
          const [ subject ] = result 

          response.render('edit_card', { card, subject, subjects  } )     
        })
    })
})

router.post('/edit/:card_id', (request, response) => {
  const { card_id } = request.params
  const { front, back, id } = request.body
  const subject_id = id

  Card.update(front, back, subject_id, card_id)
    .then( () => {
      response.redirect(`/subjects/${subject_id}`)
    })
})

module.exports = router
