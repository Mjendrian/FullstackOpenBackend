const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('rbody', function (req, res) { return JSON.stringify(req.body) })
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :rbody'

app.use(morgan(morganFormat))

  // Middleware : Catch requests without route
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Info request
app.get('/info', (request, response) => {
    const returnString = `
    <p>The phonebook contains ${persons.length} contacts</p>
    <p>The request was received at ${new Date}</p>`
    response.send(returnString)   
})

// Phonebook list
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Phonebook entry show
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {    
        response.json(person)  
    } else {    
        response.status(404).end()  
    }
})

// Phonebook delete entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

// Phonebook add entry
app.post('/api/persons', (request, response) => {
    const body = request.body

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

    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})