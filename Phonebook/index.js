const express = require('express')
var morgan = require('morgan')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan('tiny'))

const cors = require('cors')

app.use(cors())

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

app.post('/api/persons', postMorgan, (request, response, next) => {
  const body = request.body;

  if (!body.name || body.name.length < 3) {
    return response.status(400).json({ error: 'Name must be at least three characters long' });
  }
  if (!body.number) {
    return response.status(400).json({ error: 'Number missing' });
  }

  const phoneRegex = /^(?:\d{3}-\d{5,}|\d{2}-\d{6,})$/;
  if (!phoneRegex.test(body.number)) {
    return response.status(400).json({ error: 'Invalid phone number format' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', async (request, response, next) => {
  try {
    const count = await Person.countDocuments({});
    const date = new Date();

    response.send(
      `<p>Phonebook has info for ${count} persons</p>
      <br>
      <p>${date}</p>`
    );
  } catch (error) {
    next(error);
  }
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  console.log('Deleting person with ID:', id);

  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const updatedPerson = request.body;

  if (!updatedPerson.name || !updatedPerson.number) {
    return response.status(400).json({ error: 'Name and number are required fields' });
  }

  if (updatedPerson.name.length < 3) {
    return response.status(400).json({ error: 'Name must be at least three characters long' });
  }

  const phoneRegex = /^(?:\d{3}-\d{5,}|\d{2}-\d{6,})$/;
  if (!phoneRegex.test(updatedPerson.number)) {
    return response.status(400).json({ error: 'Invalid phone number format. Phone number must have length of 8 or more and be in the format "XX-XXXXXXX" or "XXX-XXXXXXXX"' });
  }

  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then(updated => {
      if (updated) {
        response.json(updated);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})