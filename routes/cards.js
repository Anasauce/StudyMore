import express from 'express'
import {Subject, Card} from '../database/db'
const router = express.Router()

/* GET home page. */
router.get('/new', (request, response, next) => {
  const {id} = request.user

  Subject.findById(id)
      .then(result => {
        console.log(result);
        response.render('create_card', { subject:  result })
      }).catch(error => {
        response.send({message: error})
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
