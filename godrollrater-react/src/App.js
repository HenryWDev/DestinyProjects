import Header from './components/Header.js'
import React, { useState, useEffect } from 'react'
import getRatedWeapons from './components/getRatedWeapons'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [gunInfo, setGunInfo] = useState()
  const [gunRatings, setGunRatings] = useState()
  const [colourblindMode, setColourblindMode] = useState()
  const [isAuthenticated, setisAuthenticated] = useState()
  const [loadingInfo, setLoadingInfo] = useState()


  useEffect(() => {
    let query_string = window.location.search;
    let url_params = new URLSearchParams(query_string);
    let auth_code = url_params.get('code');
    if (auth_code != null){
      getRatedWeapons()
    }
  }, [])


  return (
    <div>
      <Header
        colourblindMode = {colourblindMode}
        setColourblindMode = {() => setColourblindMode(!colourblindMode)}

      />
    </div>
  );
}

export default App;
