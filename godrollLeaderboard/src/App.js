import Header from './components/Header.js'
import React, { useState, useEffect } from 'react'
import getLeaderboard from './components/script.js'
import './components/style.css'
import ArchiveHandler from './components/ArchiveHandler'

import 'bootstrap/dist/css/bootstrap.min.css';

import season1 from './archive/season1.json';


function App() {
  const [currentLeaderboardInfo, setCurrentLeaderboardInfo] = useState() // non archived leaderboard info, from api
  const [leaderboardInfo, setLeaderboardInfo]               = useState() // current leaderboard to display
  const [devMode, setDevMode]                               = useState(false)
  const [gunInfo, setGunInfo]                               = useState() // deprecated, used only for season 1
  const [isLoaded, setIsLoaded]                             = useState(false)
  const [colourblindMode, setColourblindMode]               = useState(false)
  const [displayAllScores, setDisplayAllScores]             = useState(false)
  const [leaderboardSelection, setLeaderboardSelection]     = useState("current")
  const [permittedPlayers]                                  = useState([
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
    "4611686018486567832",//  Vulcan
  ])

  useEffect(() => {
    getLeaderboard()
    .then(response => {
    setCurrentLeaderboardInfo(response)

    setLeaderboardInfo(response)
    setIsLoaded(true)
    })
  }, [])

  const SelectLeaderboard = (selection) => {
    if (selection === "current"){
      setLeaderboardInfo(currentLeaderboardInfo)
      setLeaderboardSelection("current")
      console.log("2")
    }
    else if (selection === "season1") {
      setLeaderboardInfo(season1.users)
      setGunInfo(season1.GunInfo)
      setLeaderboardSelection("season1")
      console.log("1")
    }
  }


  return (
    <div>
      <Header
        changeCBMode={() => setColourblindMode(!colourblindMode)}
        changeDisplayMode={() => setDisplayAllScores(!displayAllScores)}
        changeDebugMode={() => setDevMode(!devMode)}
        SelectLeaderboard={SelectLeaderboard}

      />
      {isLoaded && <ArchiveHandler
                      colourblindMode={colourblindMode}
                      leaderboardInfo={leaderboardInfo}
                      gunInfo={gunInfo}
                      permittedPlayers={permittedPlayers}
                      displayAllScores={displayAllScores}
                      devMode={devMode}
                      leaderboardSelection={leaderboardSelection}
                    />}

    </div>
  );
}

export default App;
