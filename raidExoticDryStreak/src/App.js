
import NavOptions from './components/NavOptions';
import Header from './components/Header'
import Authenticate from './components/Authenticate'
import RaidDisplay from './components/RaidDisplay'
import run from './components/ParseInfo'

import './index.css'

import React, { useState, useEffect, useRef } from 'react'



function App() {
  const api_key = "332d0342ec34497d83f8107ceb8be471"
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isLoaded, setIsLoaded]               = useState(false)
  const [characterInfo, setCharacterInfo]     = useState()
  const [membershipInfo, setMembershipInfo]   = useState(
    {
      membershipID: "4611686018483122657",
      membershipType: "3",
    }
  )


  const [raidInfo, setRaidInfo] = useState(
    [
    {id: 1,
    name: "Vault of Glass",
    gunHash: "4289226715",
    hash: [3881495763,1681562271,1485585878,3711931140],},

    {id: 2,
    name: "Deep Stone Crypt",
    gunHash: "2399110176",
    hash: [910380154,],},

    {id: 3,
    name: "Last Wish",
    gunHash: "2069224589",
    hash: [2122313384,],}
    ]
  )

  const [selectedRaid, setSelectedRaid] = useState(
    {}
  );


  useEffect(() => {
    run(raidInfo, setRaidInfo, setIsLoaded, membershipInfo, api_key, setCharacterInfo)
    selectRaid(1)
  }, [])





  const selectRaid = (raidID) => {
    setSelectedRaid(raidInfo.filter((raidInfo) => raidInfo.id === raidID)[0])
    console.log("selected raid: ",selectedRaid)
  }


  return (
    <div >
      <div>
        <Header />
        {isAuthenticated && <NavOptions raidInfo={raidInfo} selectRaid={selectRaid}/>}
        {isLoaded && <RaidDisplay selectedRaid={selectedRaid} characterInfo={characterInfo}/>}
      </div>
      <p>ee</p>
    </div>
  );
}



export default App;
