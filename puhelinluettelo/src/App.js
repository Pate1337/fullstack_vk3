import React from 'react'
import Person from './components/Person'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filter: '',
      successMessage: null,
      errorMessage: null
    }
    console.log('constructor')
  }

  componentDidMount() {
    console.log('will mount')
    const nonExisting = {
      name: 'Tämä ei ole palvelimella',
      number: '3RR0R',
      id: 10000
    }
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        this.setState({ persons: response.data.concat(nonExisting) })
      })
  }

  addPerson = (event) => {
    event.preventDefault()
    const noteObject = {
      name: this.state.newName,
      number: this.state.newNumber
    }

    const nimiLista = this.state.persons.map(person => person.name)

    if (this.state.newName == '') {
      this.setState({
        newName: '',
        newNumber: ''
      })
      alert('Nimi on pakollinen!')
    } else if (nimiLista.includes(this.state.newName)) {
      const person = this.state.persons.find(p => p.name === this.state.newName)
      if (window.confirm(person.name + " on jo luettelossa, korvataanko vanha numero uudella?")) {
        const changedPerson = { ...person, number: this.state.newNumber }
        console.log(changedPerson)
        console.log(person)
        personService
          .update(person.id, changedPerson)
          .then(response => {
            const persons = this.state.persons.filter(p => p.id != person.id)
            this.setState({
              persons: persons.concat(response.data),
              newName: '',
              newNumber: '',
              successMessage: 'Henkilön ' + person.name + ' numero päivitetty!'
            })
            setTimeout(() => {
              this.setState({successMessage: null})
            }, 5000)
          })
          .catch(error => {
            this.setState({
              errorMessage: 'Henkilö ' + this.state.newName + ' on jo poistettu palvelimelta',
              persons: this.state.persons.filter(p => p.id !== person.id),
              newName: '',
              newNumber: ''
            })
            setTimeout(() => {
              this.setState({errorMessage: null})
            }, 5000)
          })
      } else {
        this.setState({
          newName: '',
          newNumber: ''
        })
      }

    } else {
      personService
        .create(noteObject)
        .then(response => {
          this.setState({
            persons: this.state.persons.concat(response.data),
            newName: '',
            newNumber: '',
            successMessage: 'Henkilö ' + noteObject.name + ' lisätty!'
          })
          setTimeout(() => {
            this.setState({successMessage: null})
          }, 5000)
        })
      console.log('Henkilö ' + noteObject.name + ' lisätty!')
    }
  }

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }


  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value })
  }

  removePerson = (event) => {
    event.preventDefault()
    const id = event.target.id
    const person = this.state.persons.filter(p =>
      p.id == id)
    console.log(this.state.persons)
    console.log(person)

    if (window.confirm("Poistetaanko " + person[0].name + "?")) {
      personService
        .poista(person[0])
        .then(response => {
          console.log(id)
          const persons = this.state.persons.filter(p => p.id != id)
          console.log(persons)
          this.setState({
            persons: persons,
            successMessage: person[0].name + ' poistettu!'
          })
          setTimeout(() => {
            this.setState({successMessage: null})
          }, 5000)
        })
        .catch(error => {
          this.setState({
            errorMessage: 'Henkilö ' + person[0].name + ' on jo poistettu palvelimelta',
            persons: this.state.persons.filter(p => p.id !== person[0].id),
            newName: '',
            newNumber: ''
          })
          setTimeout(() => {
            this.setState({errorMessage: null})
          }, 5000)
        })
    }

  }

  render() {
    console.log('render')
    console.log(this.state.persons)
    const personsToShow =
      this.state.persons.filter(person =>
        person.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1
        || person.number.indexOf(this.state.filter) !== -1)
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification type="success" message={this.state.successMessage} />
        <Notification type="error" message={this.state.errorMessage} />
        <div>rajaa näytettäviä <input value={this.state.filter} onChange={this.handleFilterChange}/></div>
        <form onSubmit={this.addPerson}>
          <h3>Lisää uusi</h3>
          <div>nimi: <input value={this.state.newName} onChange={this.handleNameChange}/></div>
          <div>numero: <input value={this.state.newNumber} onChange={this.handleNumberChange}/></div>
          <button type="submit">lisää</button>
        </form>
        <h3>Numerot</h3>
        <ul>
          {personsToShow.map(person => <Person key={person.id} person={person} poista={this.removePerson} />)}
        </ul>
      </div>
    )
  }
}

export default App
