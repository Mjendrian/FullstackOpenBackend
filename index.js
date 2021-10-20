const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

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


let persons =
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Info request
app.get('/info', (request, response) => {
    const returnString = `
    <p>The phonebook contains ${persons.length} contacts</p>
    <p>The request was received at ${new Date}</p>`
    response.send(returnString)   
})

// Phonebook list
app.get('/api/persons', (request, response) => {
    response.json(persons)
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
const generateId = () => {
    let newId = 1
    while(persons.find(person => person.id === newId))
        newId = Math.round(Math.random(1000)*1000)
    return newId
  }
  
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

    if (persons.find(person => person.name ===  body.name)) {
        return response.status(400).json({ 
          error: `The contact ${body.name} does already exist in the phonebook` 
        })
    }    
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})