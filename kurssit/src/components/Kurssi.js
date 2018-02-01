import React from 'react'

const Kurssi = (props) => {
  return (
    <div>
      <li>
        <Otsikko kurssi={props.kurssi} />
        <Sisalto kurssi={props.kurssi} />
        <Yhteensa kurssi={props.kurssi} />
      </li>
    </div>
  )
}

const Otsikko = (props) => {
  return (
    <div>
      <h1>{props.kurssi.nimi}</h1>
    </div>
  )
}

const Sisalto = (props) => {
  return (
    <div>
      <ul>
        {props.kurssi.osat.map(osa=><Osa key={osa.id} osa={osa} />)}
      </ul>
    </div>
  )
}

const Osa = (props) => {
  return (
      <li>{props.osa.nimi} {props.osa.tehtavia}</li>
  )
}

const Yhteensa = (props) => {
  const tehtavia = props.kurssi.osat.map(osa => osa.tehtavia)
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const yhteensa = tehtavia.reduce(reducer)
  return (
    <div>
      <p>yhteensä {yhteensa} tehtävää</p>
    </div>
  )
}

export default Kurssi
