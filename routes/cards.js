import express from 'express'
import {Subject, Card} from '../database/db'
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

module.exports = router
