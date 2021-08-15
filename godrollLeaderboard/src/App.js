import Header from './components/Header.js'
import React, { useState, useEffect } from 'react'
import getLeaderboard from './components/script.js'
import LeaderboardDisplay from './components/LeaderboardDisplay.js'

import 'bootstrap/dist/css/bootstrap.min.css';

import season1 from './archive/season1.json';


function App() {
  const [currentLeaderboardInfo, setCurrentLeaderboardInfo]
                                              = useState()
  const [leaderboardInfo, setLeaderboardInfo] = useState()
  const [currentGunInfo, setCurrentGunInfo]   = useState()
  const [gunInfo, setGunInfo]                 = useState()
  const [isLoaded, setIsLoaded]               = useState(false)
  const [colourblindMode, setColourblindMode] = useState(false)
  const [displayAllScores, setDisplayAllScores]=useState(false)
  const [permittedPlayers]                    = useState([
    "4611686018462309220",//  RCG_Josh
    "4611686018483122657",//  Doozer
    "4611686018484827478",//  Pkmt1234
    "4611686018467387394",//  Mono Antumbra
    "4611686018487834607",//  RSHNLive
    "4611686018484739079",//  SpeedyRogue
    "4611686018429564109",//  IKnightOfDawn
    "4611686018471021704",//  DaPoliceman
    "4611686018455312105",//  Joe Scorpion 45
    "4611686018429877076",//  Star Player134
    "4611686018484075688",//  WeirdNoodle
    "4611686018497753585",//  FtpApoc
    "4611686018482875471",//  Tweety
  ])

  useEffect(() => {
    console.log("season1",season1)
    getLeaderboard()
    .then(response => {
    setCurrentLeaderboardInfo(response[0])
    setLeaderboardInfo(response[0])
    setCurrentGunInfo(response[1])
    setGunInfo(response[1])
    setIsLoaded(true)

    })
  }, [])

  const SelectLeaderboard = (selection) => {
    if (selection === "current"){
      setLeaderboardInfo(currentLeaderboardInfo)
      setGunInfo(currentGunInfo)
    }
    else {
    console.log(selection)
      setLeaderboardInfo(season1.users)
      setGunInfo(season1.GunInfo)
    }
  }


  return (
    <div>
      <Header
        changeCBMode={() => setColourblindMode(!colourblindMode)}
        changeDisplayMode={() => setDisplayAllScores(!displayAllScores)}
        SelectLeaderboard={SelectLeaderboard}

      />

      {isLoaded && <LeaderboardDisplay
                      colourblindMode={colourblindMode}
                      leaderboardInfo={leaderboardInfo}
                      gunInfo={gunInfo}
                      permittedPlayers={permittedPlayers}
                      displayAllScores={displayAllScores}
                    />}
    </div>
  );
}

export default App;
