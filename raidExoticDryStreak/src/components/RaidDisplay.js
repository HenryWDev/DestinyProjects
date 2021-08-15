import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import CharacterDisplay from './CharacterDisplay'
import AddRow from './AddRow'


const RaidDisplay = ({selectedRaid, characterInfo}) => {
  console.log(selectedRaid)
  return (

    <Container className="raidDisplay">

        <CharacterDisplay characterInfo={characterInfo}/>
        <p style={{color: "red"}}> {selectedRaid["gunInfo"]["owned"]? "owned" : "not owned"} </p>
        <img src={'https://www.bungie.net' + selectedRaid["gunInfo"]["icon"]} alt="gun Icon" className="img-fluid" />
        {Object.entries(selectedRaid.completions)
        .map( ([key, value]) => (
          <>
          <AddRow key={key} startingWeek={key} displayData={value}/>
          </>
       ))}


    </Container>
  )
}

export default RaidDisplay
