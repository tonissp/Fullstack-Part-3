const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan('tiny'))

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

let phonebook = [
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

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', postMorgan, (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  if (phonebook.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info',(request, response, next) => {
	const date = new Date()
  const amount = phonebook.length
	response.send(
	  `<p>Phonebook has info for ${amount} persons</p>
    <br>
    <p>${date}</p>`
		)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})