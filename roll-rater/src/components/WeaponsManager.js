import React from 'react'
import PropTypes from 'prop-types'
import { Autocomplete } from '@mantine/core';
import { Container } from '@mantine/core';
import { Image } from '@mantine/core';
import { Grid } from '@mantine/core';
import { useState, useEffect } from 'react'
import { Button } from '@mantine/core';


const WeaponsManager = ({addWeapon, exportAllRolls}) => {
  const [manifest, set_manifest] = useState("")
  const [socket_type_definition_manifest, set_socket_type_definition_manifest] = useState('')
  const [inventory_item_manifest, set_inventory_item_manifest] = useState('');
  const [destiny_plug_set_definition, set_destiny_plug_set_definition] = useState('');
  const [destiny_stat_definition, set_destiny_stat_definition] = useState('');

  const [weapon_list, set_weapon_list] = useState([]);
  const [autofill_state, set_autofill_state] = useState(true);
  const [weapon_id, set_weapon_id] = useState(0);

  useEffect(() => {
    fetch('https://www.bungie.net/Platform/Destiny2/Manifest/')
    .then(response => response.json())
    .then(data => set_manifest(data["Response"]))
  }, []);

  useEffect(() => {
    if (manifest !== "") {
      console.log("manifest", manifest)
      fetch('https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinyInventoryItemDefinition"])
      .then(response => response.json())
      .then(data => set_inventory_item_manifest(data))

      fetch('https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinySocketTypeDefinition"])
      .then(response => response.json())
      .then(data => set_socket_type_definition_manifest(data))

      fetch('https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinyPlugSetDefinition"])
      .then(response => response.json())
      .then(data => set_destiny_plug_set_definition(data))

      fetch('https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinyStatDefinition"])
      .then(response => response.json())
      .then(data => set_destiny_stat_definition(data))

      console.log('https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinyInventoryItemDefinition"],
                  'https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinySocketTypeDefinition"],
                  'https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinyPlugSetDefinition"],
                  'https://www.bungie.net' + manifest["jsonWorldComponentContentPaths"]["en"]["DestinyStatDefinition"])

    }
  }, [manifest]);

  useEffect(() => {
    if (inventory_item_manifest !== "") {
      console.log("inventory_item_manifest", inventory_item_manifest)
      extractWeapons()
    }
  }, [inventory_item_manifest]);

  useEffect(() => {
    if (socket_type_definition_manifest !== "") {
      console.log("socket_type_definition", socket_type_definition_manifest)
    }
  }, [socket_type_definition_manifest]);

  useEffect(() => {
    if (destiny_plug_set_definition !== "") {
      console.log("destiny_plug_set_definition", destiny_plug_set_definition)
    }
  }, [destiny_plug_set_definition]);

  useEffect(() => {
    if (destiny_stat_definition !== "") {
      console.log("destiny_stat_definition", destiny_stat_definition)
    }
  }, [destiny_stat_definition]);

  function extractWeapons(){
    let group = ""
    let to_remove = []
    let test = [];
    let test2 = [];
    let tmp_array = [];
    let non_sunset = [3340296461, 2759499571]
    for (let k in inventory_item_manifest){
      if (inventory_item_manifest[k]["itemType"] == "3"){
        if (non_sunset.includes(inventory_item_manifest[k]["quality"]["versions"][0]["powerCapHash"])){
          tmp_array.push({value: inventory_item_manifest[k]["displayProperties"]["name"] + " : " +  k})
          inventory_item_manifest[k]["value"] = inventory_item_manifest[k]["displayProperties"]["name"]
          if (test.indexOf(inventory_item_manifest[k]["quality"]["versions"][0]["powerCapHash"]) === -1){
             test.push(inventory_item_manifest[k]["quality"]["versions"][0]["powerCapHash"] )
             test2.push(inventory_item_manifest[k]["displayProperties"]["name"])
           }
        }
        else{
          to_remove.push(k)
        }

      }
    }
    set_autofill_state(false)
    set_weapon_list(tmp_array)
  }

  function selectWeapon(weapon){
    let id = weapon.split(": ")[1]
    if (id in inventory_item_manifest){
      set_weapon_id(id)
    }
  }

  function getWeapon(){
    console.log(inventory_item_manifest[weapon_id])
    let weapon_dict = {}
    let investment_stats = []
    const perk_slots = ["1", "2","3","4"]
    if (weapon_id !== 0){
      weapon_dict[weapon_id] = inventory_item_manifest[weapon_id]

      // extract perk information
      let plug_hash = 0
      for (let perk_column in perk_slots){
        weapon_dict[weapon_id]["perks " + perk_column] = {}
        plug_hash = inventory_item_manifest[weapon_id]["sockets"]["socketEntries"][perk_slots[perk_column]]["randomizedPlugSetHash"]
        if (plug_hash == null){
          console.log("non ramdomised perks")
          return;
        }
        for (let perk in destiny_plug_set_definition[plug_hash]["reusablePlugItems"]){
          let perk_hash = destiny_plug_set_definition[plug_hash]["reusablePlugItems"][perk]["plugItemHash"]
          if (inventory_item_manifest[perk_hash]["itemTypeDisplayName"] !== "Enhanced Trait"){
            weapon_dict[weapon_id]["perks " + perk_column][perk_hash] = inventory_item_manifest[perk_hash]
            weapon_dict[weapon_id]["perks " + perk_column][perk_hash]["rating"] = 0
          }
        }
      }

      weapon_dict[weapon_id]["masterworks"] = {}
      if (weapon_dict[weapon_id]["itemTypeDisplayName"] === "Sword"){
        weapon_dict[weapon_id]["masterworks"]["4043523819"] = inventory_item_manifest["3486498337"]
        weapon_dict[weapon_id]["masterworks"]["4043523819"]["name"] = destiny_stat_definition["4043523819"]["displayProperties"]["name"]
        weapon_dict[weapon_id]["masterworks"]["4043523819"]["rating"] = 3
      }
      else{
        // get masterworks
        for (let key in weapon_dict[weapon_id]["investmentStats"]){
          investment_stats.push(String(weapon_dict[weapon_id]["investmentStats"][key]["statTypeHash"]))
        }

        let reusable_plug_hash = weapon_dict[weapon_id]["sockets"]["socketEntries"]["7"]["reusablePlugSetHash"]
        let plug_dict = destiny_plug_set_definition[reusable_plug_hash]["reusablePlugItems"]
        for (let plug in plug_dict){

          let plugItemHash = plug_dict[plug]["plugItemHash"]
          let masterwork_info = inventory_item_manifest[plugItemHash]
          let stat_hash = String(inventory_item_manifest[plugItemHash]["investmentStats"]["0"]["statTypeHash"])
          if (investment_stats.includes(stat_hash) && stat_hash !== "4043523819"){
            weapon_dict[weapon_id]["masterworks"][stat_hash] = masterwork_info
            weapon_dict[weapon_id]["masterworks"][stat_hash]["name"] = destiny_stat_definition[stat_hash]["displayProperties"]["name"]
            weapon_dict[weapon_id]["masterworks"][stat_hash]["rating"] = 0
          }
        }
      }

      // add pvp/pvp ratings
      weapon_dict[weapon_id]["is_pvp_roll"] = 0
      weapon_dict[weapon_id]["is_pve_roll"] = 0
      weapon_dict[weapon_id]["description"] = ""
      console.log(weapon_dict)
      addWeapon(weapon_dict)
    }
  }


  return (
    <Grid gutter="md" className="p-3" >
      <Grid.Col span={1}>
        {weapon_id?
          <Image
            className="object-center float-right"
            width={60}
            height={60}
            radius="sm"
            src={"https://www.bungie.net/" + inventory_item_manifest[weapon_id]["displayProperties"]["icon"]}
            alt="weaponPreview">
          </Image>
          :
          <Image
            className="object-center float-right"
            width={60}
            height={60}
            radius="sm"/>
        }
      </Grid.Col>
      <Grid.Col className="ml-3" span={5}>
        {autofill_state?
          <Autocomplete
            className=""
            placeholder="Pick one"
            data = {[]}
            disabled
          />
        :
          <Autocomplete
            className=""
            placeholder="Pick one"
            data={weapon_list}
            value={inventory_item_manifest}
            onChange={selectWeapon}
          />
        }
      </Grid.Col>
      <Grid.Col className="ml-6" span={1}>
        {autofill_state?
          <Button disabled variant="outline">
            Add Weapon
          </Button>
        :
        <Button onClick={getWeapon} variant="outline" >
          Add Weapon
        </Button>
        }
      </Grid.Col>
      <Grid.Col className="" span={2}>
        {autofill_state?
          <Button disabled color="lime" variant="outline">
            Add Weapon
          </Button>
        :
        <Button onClick={exportAllRolls} color="lime" variant="outline" >
          Export All
        </Button>
        }
      </Grid.Col>
    </Grid>

  )
}

export default WeaponsManager
