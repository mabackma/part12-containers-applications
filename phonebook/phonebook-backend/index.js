require('dotenv').config()
const express = require('express')
const app = express()

// Show static content from frontend
app.use(express.static('dist'))

// Use cors
const cors = require('cors')
app.use(cors())

// Parse JSON to objects
app.use(express.json())

// Show info from requests
const morgan = require('morgan')

// Define a custom token for the request body
morgan.token('reqbody', (req) => {
  if (req.method === 'POST') {
    const { id, ...bodyWithoutId } = req.body
    console.log('id: ', id)
    return JSON.stringify(bodyWithoutId)
  }
  return ''
})

// Configure morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))

// Import the database module
const Contact = require('./models/contact')

// Gets all contacts from phonebook
app.get('/api/persons', (request, response, next) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  }).catch(error => next(error))
})

// Gets one contact by id from phonebook
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(contact => {
    if (contact) {
      const formattedResponse = `{
    "name": "${contact.name}",
    "number": "${contact.number}",
    "id": "${contact.id}"
}`  // looks weird but it works in the browser
      response.type('application/json').send(formattedResponse)
    }
    else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

// Creates a new contact
app.post('/api/persons', (request, response, next) => {
  const person = request.body

  // Check both name and number are included
  if(!person.name || !person.number) {
    return response.status(400).json({ error: 'Name and number are required' })
  }

  // Create new contact
  const contact = new Contact({
    name: person.name,
    number: person.number,
  })

  // Save new contact
  contact.save().then(savedContact => {
    response.json(savedContact)
  }).catch(error => next(error))
})

// Changes the number of a person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Contact.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

// Deletes a person
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id).then(result => {
    console.log(result)
    response.status(204).end()
  }).catch(error => next(error))
})

// Shows the info for the backend
app.get('/info', (request, response, next) => {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long'
  }

  const formattedDate = new Date().toLocaleString('en-FI', options).replace(/,/g, '')

  // Counts the contacts in the database
  Contact.count().then(count => {
    response.send(`Phonebook has info for ${count} people<br><br>${formattedDate}`)
  }).catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})