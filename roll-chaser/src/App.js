import logo from './logo.svg';
import { useState, useEffect } from 'react'
import WeaponDisplay from './components/WeaponDisplay.js'
import { MantineProvider } from '@mantine/core';
import RatedRolls from './rated_rolls.json'
import SearchBar from './components/SearchBar.js'

function App() {
  const [weapon_index, set_weapon_index] = useState({});
  const [change_state, set_change_state] = useState(false);
  const [weapon_list, set_weapon_list] = useState({});
  const [original_weapon_index, set_original_weapon_index] = useState({});

  useEffect(() => {
    let counter = 0
    let temp_dict = {}
    let tmp_weapon_list = []
    for (let dict in RatedRolls["jsonfiles"]){
      for (let weapon_roll in RatedRolls["jsonfiles"][dict]){
        let temp_weapon_dict = {}
        let weapon_key = weapon_roll
        let altered_key = counter + ":" + weapon_roll
        temp_weapon_dict["name"] = RatedRolls["jsonfiles"][dict][weapon_roll]["displayProperties"]["name"]
        temp_weapon_dict["hash"] = weapon_roll.split(":")[1]
        temp_dict[altered_key] = RatedRolls["jsonfiles"][dict][weapon_roll]
        counter += 1

        // this could be less cringe
        let hit = false
        for (let value in tmp_weapon_list){
          if (tmp_weapon_list[value]["name"] === temp_weapon_dict["name"]){
            hit = true
          }
        }
        if (hit === false){
          tmp_weapon_list.push(temp_weapon_dict)
        }
      }
    }
    set_weapon_list(tmp_weapon_list)
    set_weapon_index(temp_dict)
    set_original_weapon_index(temp_dict)
  }, []);



  function filter_list(selected_weapons){
    if (selected_weapons.length > 0){
      let tmp_list = []
      let tmp_index = {}
      for (let weapon in selected_weapons){
        tmp_list.push(selected_weapons[weapon]["hash"])
      }
      for (let weapon in original_weapon_index){
        if (tmp_list.includes(weapon.split(":")[2])){
          tmp_index[weapon] = original_weapon_index[weapon]
        }
      }
      set_weapon_index(tmp_index)
    }
    else{
      set_weapon_index(original_weapon_index)
    }
  }


  return (
    <div>
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <SearchBar weapon_list={weapon_list} filter_list={filter_list}/>
        {Object.keys(weapon_index).map((key,i) => (
          <WeaponDisplay weapon_dict={weapon_index} key={key} index={key} deleteWeapon={""}/>
        ))}
      </MantineProvider>
    </div>
  );
}

export default App;
