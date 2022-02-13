import Header from './components/Header.js'
import AuthenticateButton from './components/AuthenticateButton.js'
import Authenticate from './components/Authenticate.js'
import AlertBox from './components/AlertBox.js'
import LoadingView from './components/LoadingView.js'
import getRatedWeapons from './components/getRatedWeapons'
import RollDisplay from './components/RollDisplay'
import Info from './components/Info'
import uploadScores from './components/UploadScores'

import React, { useState, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [perkInfo, setPerkInfo]               = useState([])
  const [gunRatings, setGunRatings]           = useState([])
  const [weaponRatings, setWeaponRatings]     = useState()
  const [filteredRatings, setFilteredRatings] = useState([])
  const [userInfo, setUserInfo]               = useState()
  const [searchQueries, setSearchQueries]     = useState()
  const [currentQuery, setCurrentQuery]       = useState([])
  const [displayLimit, setDisplayLimit]       = useState(100)
  const [debugMode, setDebugMode]             = useState(false)
  const [newOnlyMode, setNewOnlyMode]         = useState(false)
  const [currentSeasonOnlyMode, setCurrentSeasonOnlyMode] = useState(false)
  const [colourblindMode, setColourblindMode] = useState(false)
  const [showError, setShowError]             = useState(false);
  const [showAuthButton, setShowAuthButton]   = useState(false)
  const [showLoadingView, setShowLoadingView] = useState(false)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [showDisplayInfo, setShowDisplayInfo] = useState(false)
  const [loadingMessage, setLoadingMessage]   = useState(
    ["loading the datas"]
  )
  const [errorMessage, setErrorMessage]       = useState(
    ["placeholder Title", "sounds like a you problem"]
  )


  useEffect(() => {
    let query_string = window.location.search;
    let url_params = new URLSearchParams(query_string);
    let auth_code = url_params.get('code');

    if (getCookie("access_token") !== null){
      console.log("[+] valid cookie detected, skipping authorization")
      setShowAuthButton(false)
      setShowLoadingView(true)
      getRatedWeapons(getCookie("access_token"),
                      setUserInfo,
                      setWeaponRatings,
                      setPerkInfo,
                      setGunRatings,
                      setSearchQueries,
                      setLoadingMessage,
                      setErrorMessage,
                      setShowError)
      .then((response) => {
        console.log("[+]", response)
      })
    }
    else {
      if (auth_code != null){
        Authenticate(auth_code).then((response) => {
          if (response === -1){
            setErrorMessage(["Authentication Error",
                            "authentication failed, try reauthenticating"])
            setShowError(true)
            setShowAuthButton(true)
          }
          else{
            setShowAuthButton(false)
            setShowLoadingView(true)
            getRatedWeapons(response,
                            setUserInfo,
                            setWeaponRatings,
                            setPerkInfo,
                            setGunRatings,
                            setSearchQueries,
                            setLoadingMessage,
                            setErrorMessage,
                            setShowError)
            .then((response) => {
              console.log("[+]", response)
            })
          }
        })
      }
    else{
      setErrorMessage(["Authentication Error",
                      "You are not/no longer authenticated with this website, please click the Authenticate button to authenticate!"])
      setShowError(true)
      setShowAuthButton(true)
    }
  }
  }, [])

  function getCookie(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var end = 0;
      var begin = dc.indexOf("; " + prefix);
      if (begin === -1) {
          begin = dc.indexOf(prefix);
          if (begin !== 0) return null;
          end = document.cookie.indexOf(";", begin);
          if (end === -1) {
          end = dc.length;
          }
      }
      else
      {
          begin += 2;
          end = document.cookie.indexOf(";", begin);
          if (end === -1) {
          end = dc.length;
          }
      }
      // because unescape has been deprecated, replaced with decodeURI
      //return unescape(dc.substring(begin + prefix.length, end));
      return decodeURI(dc.substring(begin + prefix.length, end));
  }


  useEffect(() => {
    if (Object.keys(gunRatings).length !== 0){
      updateFilteredRolls(searchQueries)
      setShowLoadingView(false)
      setLoadingComplete(true)
      if (Object.keys(perkInfo).length !== 0){
        uploadScores(gunRatings, userInfo, perkInfo)
      }
      else {
        console.log("oh no")
      }
    }
  }, [gunRatings]);

  const updateFilteredRolls = (queryList) => {
    console.log("[+] Query: ", queryList, " Display Length: ", displayLimit, " New only: ", newOnlyMode, " Recently added only: ", currentSeasonOnlyMode)
    const ratings_copy = clone(gunRatings)
    let temp_dict = {}

    if (newOnlyMode){
      for (const [hash, roll] of Object.entries(ratings_copy)){
        for (const [activity_type, weapon_info] of Object.entries(roll)){
          let temp_array = []
          for (const weapon of weapon_info.weapons){
            if (weapon.new){
              temp_array.push(weapon)
            }
          }
          ratings_copy[hash][activity_type].weapons = temp_array;
        }
      }
    }

    if (currentSeasonOnlyMode){
      for (const [hash, roll] of Object.entries(ratings_copy)){
        for (const [activity_type, weapon_info] of Object.entries(roll)){
          let temp_array = []
          if (!(weapon_info.gun_info["current season"])){
            delete ratings_copy[hash][activity_type]
          }
        }
      }
    }

    for (const [hash, roll] of Object.entries(ratings_copy)){
      if (queryList.length === 0){
        temp_dict[hash] = roll
        for (const [activity_type,] of Object.entries(roll)){
          temp_dict[hash][activity_type]["weapons"] = temp_dict[hash][activity_type]["weapons"].slice(0, displayLimit)
        }
      }
      else {
        if(queryList.some(e => e.hash === hash)) {
          temp_dict[hash] = roll

          for (const [activity_type,] of Object.entries(roll)){
            temp_dict[hash][activity_type]["weapons"] = temp_dict[hash][activity_type]["weapons"].slice(0, displayLimit)
          }
        }
      }
    }
    setFilteredRatings(temp_dict)
  }

  useEffect(() => {
    updateFilteredRolls(currentQuery)

  }, [displayLimit, currentQuery, newOnlyMode, currentSeasonOnlyMode]);

  function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

  return (
    <div>
      <Header
        colourblindMode = {colourblindMode}
        setColourblindMode = {() => setColourblindMode(!colourblindMode)}
        debugMode = {debugMode}
        setDebugMode = {() => setDebugMode(!debugMode)}
        newOnlyMode = {newOnlyMode}
        setNewOnlyMode = {() => setNewOnlyMode(!newOnlyMode)}
        searchQueries = {searchQueries}
        loadingComplete = {loadingComplete}
        setCurrentQuery={setCurrentQuery}
        setDisplayLimit = {setDisplayLimit}
        currentSeasonOnlyMode = {currentSeasonOnlyMode}
        setShowDisplayInfo={() => setShowDisplayInfo(!showDisplayInfo)}
        setCurrentSeasonOnlyMode = {() => setCurrentSeasonOnlyMode(!currentSeasonOnlyMode)}
      />
    <Info
      searchQueries={searchQueries}
      showDisplayInfo={showDisplayInfo}
      setShowDisplayInfo={() => setShowDisplayInfo(!showDisplayInfo)}
    />
      {showAuthButton && <AuthenticateButton />}
      {showLoadingView && <LoadingView
                          loadingMessage={loadingMessage}
                          />}
      {loadingComplete   && <RollDisplay
                            perkInfo={perkInfo}
                            gunRatings={filteredRatings}
                            colourblindMode={colourblindMode}
                            debugMode={debugMode}
                            weaponRatings={weaponRatings}
                            />}
      <AlertBox
        show = {showError}
        setShow = {() => setShowError(!showError)}
        errorMessage = {errorMessage}
      />

    </div>
  );
}

export default App;
