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




app.get('/api/persons', (request, response) => {
  contacts.find({})
    .then(data => response.json(data))
})


app.get('/info', (request, response) => {
  contacts.find({})
    .then(data => {
      const len = data.length
      const now = new Date()
      const responseString = `Phonebook has info for ${len} poeple</br>${now}`
      response.send(responseString)
    }
  )
})

app.get('/api/persons/:id', (request, response) => {
  contacts.findById(request.params.id)
    .then(contact => {
      response.json(contact)
    })
  })


app.delete('/api/persons/:id', (request, response) => {
  contacts.findByIdAndRemove(request.params.id).then(response.status(204).end())
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: "All data fields weren't filled"})
  }
  /*else if (contacts.find(contact => contact.name === request.body.name)) {
    return response.status(400).json({error: "The name is already in the contacts"})
  }
  */
  const contact = new contacts({
    name: request.body.name,
    number: request.body.number
  })
  contact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
})



const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)