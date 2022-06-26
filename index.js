const express = require('express')
const morgan = require('morgan')
const contact = require('./models/contact')
require('dotenv').config()
const contacts = require('./models/contact')


const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('content', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content '))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/api/persons', (request, response, next) => {
  contacts.find({})
    .then(data => response.json(data))
    .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  contacts.find({})
    .then(data => {
      const len = data.length
      const now = new Date()
      const responseString = `Phonebook has info for ${len} poeple</br>${now}`
      response.send(responseString)
    .catch(error => next(error))
    }
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  contacts.findById(request.params.id)
    .then(contact => {
      response.json(contact)
    })
    .catch(error => next(error))
  })


app.delete('/api/persons/:id', (request, response, next) => {
  contacts.findByIdAndRemove(request.params.id).then(response.status(204).end())
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: "All data fields weren't filled"})
  }
  
  const contact = new contacts({
    name: request.body.name,
    number: request.body.number
  })
  contact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    number: body.number
  }
  contacts.findByIdAndUpdate(body.id, contact, {new: true})
  .then(updatedContact => response.json(updatedContact))
  .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)