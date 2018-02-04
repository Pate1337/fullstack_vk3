import React from 'react';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      maat: [],
      filter: ''
    }
    console.log('constructor')
  }

  componentDidMount() {
   console.log('will mount')
   axios
     .get('https://restcountries.eu/rest/v2/all')
     .then(response => {
       console.log('promise fulfilled')
       this.setState({ maat: response.data })
     })
  }

  handleFilterChange = (event) => {
    console.log(event.target.value)
    this.setState({ filter: event.target.value })
  }

  asetaFilterArvo = (arvo) => {
    return () => {
      this.setState({ filter: arvo })
    }
  }

  render() {
    console.log('render')
    const countriesToShow =
      this.state.maat.filter(maa =>
        maa.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1)
    let kaikkiTiedot = false
    let naytettavat = []
    if (countriesToShow.length === this.state.maat.length) {
      naytettavat = []
      console.log(kaikkiTiedot)
    } else if (countriesToShow.length > 10) {
      naytettavat.push({name: 'too many matches, specify another filter'})
      console.log(kaikkiTiedot)
    } else if (countriesToShow.length > 1) {
      naytettavat = [...countriesToShow]
      console.log(kaikkiTiedot)
    } else if (countriesToShow.length == 1) {
      naytettavat = [...countriesToShow]
      kaikkiTiedot = true
      console.log(kaikkiTiedot)
    }

    return (
      <div>
        <h1>Maat</h1>
        <div>find countries: <input value={this.state.filter} onChange={this.handleFilterChange}/></div>
        <div>
            {naytettavat.map(maa => <div key={maa.name} onClick={this.asetaFilterArvo(maa.name)}><Maa kaikki={kaikkiTiedot} maa={maa} /></div>)}
        </div>
      </div>
    );
  }
}

/*Kun jotain painetaan, niin laitetaan filter maan nimeksi*/
const Maa = (props) => {
  if (props.kaikki == true) {
    return (
      <div>
        <h2>{props.maa.name} {props.maa.altSpellings[1]}</h2>
        <p>Capital: {props.maa.capital}</p>
        <p>Population: {props.maa.population}</p>
        <img src={props.maa.flag} alt={props.maa.name} width="200" height="150"/>
      </div>
    )
  } else {
    return (
      <div>
        <p>{props.maa.name}</p>
      </div>
    )
  }
}

export default App;
