import { useState, useEffect } from 'react'
import personService from './Persons'

const Filter = ({ filter, setFilter}) => {
  return (
    <div>
      filter shown with
      <input value={filter} onChange={({ target }) => setFilter(target.value)} />
    </div>
  )
}

const Notification = ({ info }) => {
  if (!info.message) {
    return
  }

  const style = {
    color: info.type==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {info.message}
    </div>
  )
}

const PersonForm = ({addPerson, newName, newNumber, setNewName, setNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: 
        <input value={newName} onChange={({ target }) => setNewName(target.value)} />
      </div>
      <div>
        number: 
        <input value={newNumber} onChange={({ target }) => setNewNumber(target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person)}>
            delete
          </button>
        </p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [info, setInfo] = useState({ message: null})

  useEffect(() => {
    personService.getAll().then((initialPersons => 
      setPersons(initialPersons)
    ))
  }, [])

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null} )
    }, 3000)
  }

  const cleanForm = () => {
    setNewName('')
    setNewNumber('') 
  }

  const updatePerson = (person) => {
    const ok = window.confirm(`${newName} is already added to phonebook, replace the number?`)
    if (ok) {
      
      personService.update(person.id, {...person, number: newNumber}).then((updatedPerson) => {
        setPersons(persons.map(p => p.id !== person.id ? p :updatedPerson ))
        notifyWith(`phon number of ${person.name} updated!`)
      })
      .catch(() => {
        notifyWith(`${person.name} has already been removed`, 'error')
        setPersons(persons.filter(p => p.id !== person.id))
      })

      cleanForm()
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(p => p.name === newName)

    if (person) {
      updatePerson(person)
      return
    }

    personService.create({
      name: newName,
      number: newNumber
    }).then(createdPerson => {
      setPersons(persons.concat(createdPerson))

      notifyWith(`${createdPerson.name} added!`)

      cleanForm()
    })
  }

  const removePerson = (person) => {
    const ok = window.confirm(`remove ${person.name} from phonebook?`)
    if ( ok ) {
      personService.remove(person.id).then( () => {
        setPersons(persons.filter(p => p.id !== person.id))
        notifyWith(`number of ${person.name} deleted!`)
      })
    }
  }

  const byFilterField =
    p => p.name.toLowerCase().includes(filter.toLowerCase())

  const personsToShow = filter ? persons.filter(byFilterField) : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification info={info} />

      <Filter filter={filter} setFilter={setFilter} />
      
      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h3>Phone numbers</h3>

      <Persons
        persons={personsToShow}
        removePerson={removePerson}
      />
    </div>
  )

}

export default App