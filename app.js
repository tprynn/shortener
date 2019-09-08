
'use strict';

const {Datastore} = require('@google-cloud/datastore')
const datastore = new Datastore()

const express = require('express')
const app = express()

app.post('/create', (req, res) => {
  if(!req.query.key) {
    res.status(400).json({'error': 'Missing key'})
    return
  }

  if(!req.query.url) {
    res.status(400).json({'error': 'Missing url'})
    return
  }

  const datastore_key = datastore.key(['link', req.query.key.toLowerCase()])

  datastore.save(
    {
      'key': datastore_key,
      'data': {
        'url': req.query.url,
      },
    },
    (err) => {
      if(err) {
        res.status(500).json({'error': err.message})
        return
      }

      res.status(200).json({})
    }
  )
})

app.get('/:key', (req, res) => {
  if(!req.params.key) {
    res.status(400).json({'error': 'Missing key'})
    return
  }

  const key = datastore.key(['link', req.params.key.toLowerCase()])

  datastore.get(key, (err, entity) => {
    if(err) {
      res.status(500).json({'error': err.message})
      return
    }

    if(!entity) {
      res.status(404).json({'error': 'Not found'})
    }

    res.redirect(entity['url'])
  })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})

module.exports = app
