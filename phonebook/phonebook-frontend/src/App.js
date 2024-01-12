import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = (props) => {
  const handleFilterChange = (event) => {
    props.setFilter(event.target.value);
  };

  return (
    <>
      filter shown with <input value={props.filter} onChange={handleFilterChange} />
    </>
  );
}

const PersonForm = (props) => {
  const handleNameChange = (event) => {
    props.setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    props.setNewNumber(event.target.value)
  }

  // Adds contact
  const addContact = (event) => {
    event.preventDefault()

    // Initialize a flag to track errors
    let isError = false;

    // Checks phonebook for duplicates
    for (const person of props.persons) {
      if (person.name === props.newName) {
        const confirmed = window.confirm(`${props.newName} is already added to phonebook, replace the old number with a new one?`)
        
        // Updates phonenumber of duplicate
        if(confirmed) {
          const changedPerson = { ...person, number: props.newNumber }

          personService
            .update(person.id, changedPerson)
            .then(returnedPerson => {
              // Updated the array with the changed person
              const updatedPersons = props.persons.map(p => p.id !== person.id ? p : returnedPerson)

              // Update the state
              props.setPersons(updatedPersons)
              props.setNewName('')
              props.setNewNumber('')

              props.setMessage(
                `Changed ${props.newName}'s number`
              )
              setTimeout(() => {
                props.setMessage(null)
              }, 3000)
            })
            .catch(error => {
              props.setErrorMessage(
                `Information of '${person.name}' has already been removed from server`
              )
              setTimeout(() => {
                props.setErrorMessage(null)
              }, 3000)
            })
        }
        
        return
      }
    }

    const personObject = {
      name: props.newName,
      number: props.newNumber
    }

    personService
    .create(personObject)
    .then(returnedPerson => {
      props.setPersons(props.persons.concat(returnedPerson))
      props.setNewName('')
      props.setNewNumber('')
    })
    .catch(error => {
      isError = true
      // Show contents of error
      props.setErrorMessage(error.response.data.error)
      setTimeout(() => {
        props.setErrorMessage(null)
      }, 3000)
    })
    .finally(() => {
      if (!isError) {
        // If no error occurred, then show that a new contact was added
        props.setMessage(
          `Added ${props.newName}`
        )
        setTimeout(() => {
          props.setMessage(null)
        }, 3000)
      }
    })
  }

  return (
    <>
      <form onSubmit={addContact}>
        <div>
          name: <input value={props.newName} onChange={handleNameChange}/>
          <br/>
          number: <input value={props.newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Person = (props) => {

  // Removes contact
  const removeContact = (event) => {
    event.preventDefault()
    
    const confirmed = window.confirm(`Delete ${props.person.name} ?`)
      if(confirmed) {
        personService
        .remove(props.person._id)
        .then(response => {
          // Filter out the deleted person from the array
          const updatedPersons = props.persons.filter(person => person._id !== props.person._id)
  
          // Update the state
          props.setPersons(updatedPersons)
        })
        .catch(error => {
          props.setErrorMessage(
            `Information of '${props.person.name}' has already been removed from server`
          )
          setTimeout(() => {
            props.setErrorMessage(null)
          }, 3000)
        })
    }
  }

  return (
    <>
      {props.person.name} {props.person.number}&nbsp;
      <button onClick={removeContact}>delete</button>
      <br />
    </>
  )
}

const Persons = (props) => {
  return (
    <>
      {props.persons.filter(person => person.name.includes(props.filter)).map(person =>
        <Person key={person.name} person={person} persons={props.persons} setPersons={props.setPersons} setErrorMessage={props.setErrorMessage}/>
      )}
    </>
  )
}

// Shows create and update notifications in green. Shows errors in red.
const Notification = ({ message, messageColor }) => {
  const notificationStyle = {
    color: messageColor,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  // Get persons from db.json
  useEffect(() => {
    personService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageColor='green' />
      <Notification message={errorMessage} messageColor='red' />
      <Filter filter={newFilter} setFilter={setNewFilter} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} 
        newName={newName} setNewName={setNewName} 
        newNumber={newNumber} setNewNumber={setNewNumber}
        setMessage={setMessage} setErrorMessage={setErrorMessage}/>
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filter={newFilter} setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App
