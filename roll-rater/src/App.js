import logo from './logo.svg';
import { useState, useEffect } from 'react'
import WeaponDisplay from './components/WeaponDisplay.js'
import WeaponsManager from './components/WeaponsManager.js'
import { MantineProvider } from '@mantine/core';

function App() {
  const [weapon_index, set_weapon_index] = useState({});
  const [counter, set_counter] = useState(0);
  const [change_state, set_change_state] = useState(false);

  function addWeapon(weaponDict){
    console.log("a", weaponDict)
    console.log("b", weaponDict[Object.keys(weaponDict)[0]])
    let new_dict = {...weaponDict[Object.keys(weaponDict)[0]]}
    // Object.assign(new_dict, weaponDict[Object.keys(weaponDict)[0]])
    let indexed_weapon_key = counter + ":" + Object.keys(weaponDict)[0]
    let updated_weapon_index = weapon_index
    updated_weapon_index[indexed_weapon_key] = new_dict
    set_weapon_index(updated_weapon_index)
    set_counter(counter + 1)
  }

  function deleteWeapon(key){
    let updated_weapon_index = weapon_index
    delete updated_weapon_index[key]
    set_weapon_index(updated_weapon_index)
    set_change_state(!change_state)
  }

  function exportAllRolls(){
    console.log(weapon_index)
    let blob = new Blob([JSON.stringify(weapon_index, null, 2)], {type : 'application/json'});
    let a = document.createElement('a');
    a.download = 'rated_rolls.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  }

  return (
    <div>
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <WeaponsManager key={"WeaponsManager"} addWeapon={addWeapon} exportAllRolls={exportAllRolls}/>
        {Object.keys(weapon_index).map((key,i) => (
          <WeaponDisplay weapon_dict={weapon_index} key={key} index={key} deleteWeapon={deleteWeapon}/>
        ))}
      </MantineProvider>
    </div>
  );
}

export default App;
