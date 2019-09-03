
'use strict';

const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

function setCorsHeaders(res) {
    res.set('Access-Control-Allow-Origin', 'https://pry.nz')
}

exports.getLink = (req, res) => {
  setCorsHeaders(res)

  if(!req.query.key) {
    res.status(400).json({'error': 'Missing key'})
    return
  }

  const key = datastore.key(['link', req.query.key])

  datastore.get(key, (err, entity) => {
    if(err) {
      res.status(500).json({'error': err.message})
      return
    }

    if(!entity) {
      res.status(404).json({'error': 'Not found'})
    }

    res.status(200).json({'url': entity['url']})
  })
};

exports.createLink = (req, res) => {
  setCorsHeaders(res)

  if(!req.query.key) {
    res.status(400).json({'error': 'Missing key'})
    return
  }

  if(!req.query.url) {
    res.status(400).json({'error': 'Missing url'})
    return
  }

  const datastore_key = datastore.key(['link', req.query.key])

  datastore.save({
    'key': datastore_key,
    'data': {
        'url': req.query.url,
    },
  }, (err) => {
    if(err) {
      res.status(500).json({'error': err.message})
      return
    }

    res.status(200).json({})
  })
}
