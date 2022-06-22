const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('content', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content '))

let contacts = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]


app.get('/api/persons', (request, response) => {
  response.send(contacts)
})


app.get('/info', (request, response) => {
  const len = contacts.length
  const now = new Date()
  const responseString = `Phonebook has info for ${len} poeple</br>${now}`
  response.send(responseString)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = contacts.find(person => person.id == id)
  if (!person) {
    response.status(404).end()
  }
  response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  contacts = contacts.filter(contact => contact.id != id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: "All data fields weren't filled"})
  }
  else if (contacts.find(contact => contact.name === request.body.name)) {
    return response.status(400).json({error: "The name is already in the contacts"})
  }
  const id = Math.floor(Math.random() * 250)
  const contact = {...request.body, id}
  contacts = contacts.concat(contact)
  response.json(contact)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)