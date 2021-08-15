import Table from 'react-bootstrap/Table'
import ColumnBody from './ColumnBody'

import './style.css'
import ColumnHeader from './ColumnHeader'

// import CharacterDisplay from './CharacterDisplay'
// import AddRow from './AddRow'


const LeaderboardDisplay = ({colourblindMode, leaderboardInfo, gunInfo, permittedPlayers, displayAllScores}) => {

  return (
    <div>

      <Table >

        <ColumnHeader gunInfo={gunInfo}/>
        <ColumnBody
          colourblindMode={colourblindMode}
          leaderboardInfo={leaderboardInfo}
          gunInfo={gunInfo}
          permittedPlayers={permittedPlayers}
          displayAllScores={displayAllScores}

        />
        </ Table>
    </div>
  )
}

export default LeaderboardDisplay


//  <CharacterDisplay characterInfo={characterInfo}/>
//  <p style={{color: "red"}}> {selectedRaid["gunInfo"]["owned"]? "owned" : "not owned"} </p>
//  <img src={'https://www.bungie.net' + selectedRaid["gunInfo"]["icon"]} alt="gun Icon" className="img-fluid" />
//  {Object.entries(selectedRaid.completions)
//  .map( ([key, value]) => (
//    <>
//    <AddRow key={key} startingWeek={key} displayData={value}/>
//    </>
// ))}
