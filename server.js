const express = require('express')
const app = express()
const path = require('path')
const request = require('request')
const port = 8080
const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, '/public')))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html')
})

app.get('/workspaces', function(req, res) {
  let options = {
    'method': 'GET',
    'url': 'https://api.getpostman.com/workspaces',
    'headers': {
      'X-Api-Key': req.headers.api_key
    }
  }
  request(options, function (error, response) { 
    if (error) {
      console.log(error)
      throw new Error(error)
    }
    res.status(200).send(response.body)
  })
})

app.get('/workspace', function(req, res) {
  let options = {
    'method': 'GET',
    'url': 'https://api.getpostman.com/workspaces/' + req.headers.workspace_id,
    'headers': {
      'X-Api-Key': req.headers.api_key
    }
  }
  request(options, function (error, response) { 
    if (error) throw new Error(error)
    res.status(200).send(response.body)
  })
})

app.get('/collection', function(req, res) {
  let options = {
    'method': 'GET',
    'url': 'https://api.getpostman.com/collections/' + req.headers.collection_uid,
    'headers': {
      'X-Api-Key': req.headers.api_key
    }
  }
  request(options, function (error, response) { 
    if (error) throw new Error(error)
    res.status(200).send(response.body)
  })
})

app.listen(port, () => console.log(`Listening at ${port}`))