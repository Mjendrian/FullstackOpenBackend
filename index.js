const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('rbody', function (req) { return JSON.stringify(req.body) })
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :rbody'

app.use(morgan(morganFormat))

// Info request
app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const returnString = `
      <p>The phonebook contains ${persons.length} contacts</p>
      <p>The request was received at ${new Date}</p>`
      response.send(returnString)
    })
    .catch(error => next(error))

})

// Phonebook list
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// Phonebook entry show
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Phonebook delete entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Phonebook add entry
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Content validation made at model level
  /*
    if (!body.name || body.name === "") {
        return response.status(400).json({
          error: 'Name missing'
        })
      }

    if (!body.number || body.number === "") {
        return response.status(400).json({
          error: 'Number missing'
        })
    }
    */

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Phonebook update entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.number || body.number === '') {
    return response.status(400).json({
      error: 'Number missing'
    })
  }

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators : true })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(500).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})