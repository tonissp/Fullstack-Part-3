import { useState, useEffect } from 'react'
import personService from './Persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)


  const Person = ({ person }) => {
    const RemovePerson = (event) => {
      const ssetRemove = person.id
      event.preventDefault()
      console.log('button clicked', event.target)
      if (window.confirm(`Delete ${person.name} ?`)) {
        personService
          .remove(ssetRemove)
          .then(() => {
            setPersons(persons.filter((person) => person.id !== ssetRemove))
          })
      }
    }
    
    return (
      <form onSubmit={RemovePerson}>
        <div>
          {person.name} {person.number} <button type="submit">delete</button>
        </div>
      </form>
    )
  }

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const AddPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.map(personss => personss.name.toLowerCase()).includes(newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personId = persons.find(person => person.name === personObject.name).id
        console.log(personObject.name)
        console.log(personId)
        personService
          .put(personObject, personId)
          .then(response => {
            console.log('res', response)
            setPersons(persons.map(person => person.id !== response.id ? person : response))
            setNotificationMessage(
              `Changed the phonenumber of ${newName}`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
          })
          setNewName('')
          setNewNumber('')
      }  

    } else {

      personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNotificationMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)
      })
      setNewName('')
      setNewNumber('')
    }
  }

  const HandleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const HandleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }



  const [query, setQuery] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <p>
          filter shown with: 
          <input type="text"
          onChange={e => setQuery(e.target.value)}/>
      </p>
      <h2>add a new</h2>
      <form onSubmit={AddPerson}>
        <div>
          name:
          <input value={newName}
          onChange={HandleNameChange}/>
        </div>
        <div>number:
          <input value={newNumber}
          onChange={HandleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {persons.filter(personss => personss.name.toLowerCase().includes(query.toLowerCase())).map(person => 
          <Person key={person.id} person={person}/>
        )}
    </div>
  )
}

export default App