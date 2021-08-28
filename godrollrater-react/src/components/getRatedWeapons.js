import rated_weapons from './ratings.json';

var apiLink = "https://3gmks9uzn3.execute-api.eu-west-2.amazonaws.com/default/Leaderboard"
var access_token = null

export default async function getRatedWeapons() {
  console.log(rated_weapons)
  getWeaponInfo()
  getMaxScore()
  console.log(rated_weapons)
}


async function getWeaponInfo() {
  let weapon = null
  let weapon_hashes = Object.keys(rated_weapons);
  console.log(weapon_hashes)
  await Promise.all(weapon_hashes.map(async (weapon) => {
    let result = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${weapon}/`, false)
    rated_weapons[weapon]["info"]["image"] = result["Response"]
                                                    ["displayProperties"]
                                                    ["icon"]
    return weapon
  }));
}


function getMaxScore(){
  let weapon_hashes = Object.keys(rated_weapons);
  let to_rate = ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]
  weapon_hashes.map(async (weapon) => {
    to_rate.forEach( key => {
      rated_weapons[weapon][key]["max_score"] = rated_weapons[weapon][key][Object.keys(rated_weapons[weapon][key]).reduce((a, b) =>
        rated_weapons[weapon][key][a] > rated_weapons[weapon][key][b] ? a : b
      )]
    });
  })
}


// used for all generic api calls
async function makeAPICall(link, authorised) {
  var api_key = '0a1471885265447e9b9c2d23c50f285c';
  var baseLink = "https://www.bungie.net"
  let myHeaders = new Headers();
  myHeaders.append('X-API-Key', api_key)
  if (authorised){
    myHeaders.append('Authorization', "Bearer " + access_token)
  }

  let response = await fetch(baseLink + link, {
    method: 'GET',
    headers: myHeaders
  });
  let data = await response.json();
  return data;
}
