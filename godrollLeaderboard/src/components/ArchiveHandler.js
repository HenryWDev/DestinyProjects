import Season1 from './season1/LeaderboardDisplay.js'
import Current from './season2/LeaderboardDisplay.js'


const ArchiveHandler = ({devMode, colourblindMode, leaderboardInfo, gunInfo, permittedPlayers, displayAllScores, leaderboardSelection}) => {

  const renderElement = (info) => {
    if (leaderboardSelection === "current"){
      return(
        <Current
          colourblindMode={colourblindMode}
          leaderboardInfo={leaderboardInfo}
          gunInfo={gunInfo}
          permittedPlayers={permittedPlayers}
          displayAllScores={displayAllScores}
          devMode={devMode}
        />
      )
    }
    else if (leaderboardSelection === "season1"){
      return (
        <Season1
          colourblindMode={colourblindMode}
          leaderboardInfo={leaderboardInfo}
          gunInfo={gunInfo}
          permittedPlayers={permittedPlayers}
          displayAllScores={displayAllScores}
          devMode={devMode}
        />
      )
    }
  }

  return (
    <>
      {renderElement()}
    </>
  )
}

export default ArchiveHandler
