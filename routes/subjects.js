import express from 'express'
const router = express.Router()

import { Subject, Card } from '../database/db'

router.get('/:id', (request, response, next ) => {
  const { id } = request.params
  const query = [ Subject.find( id ), Card.findBySubjectId( id ) ]

  Promise.all( query )
    .then( result => {
      const [ subject, cards ] = result
      response.render( 'subjects', { subject, cards } )
    })
})

router.get('/new', (req, res, next) => {
  res.render('subjects/create')
})

router.post('/create-subject', ( request, response ) => {
  const { id } = request.user
  const { title } = request.body

  Subject.create( title, id ).then( result => {
    res.redirect(`/subjects/${result.id}`)
  })
})

module.exports = router
