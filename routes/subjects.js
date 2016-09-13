import express from 'express'
const router = express.Router()

import { Subject } from '../database/db'

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
