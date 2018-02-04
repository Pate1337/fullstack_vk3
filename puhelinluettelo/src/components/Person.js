import React from 'react'

const Person = (props) => {
  return (
    <li>
      {props.person.name} {props.person.number}
      <button onClick={props.poista} id={props.person.id}>Poista</button>
    </li>
  )
}

export default Person
