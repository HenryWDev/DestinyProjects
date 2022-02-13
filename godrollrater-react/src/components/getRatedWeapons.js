import rated_weapons from './ratings.json';


// used for all generic api calls
async function makeAPICall(link, authorised, access_token, setErrorMessage, setShowError) {
  // local
  // var api_key = '1652b5efcc36407cb8fc4dbba23b98b8';

  // live
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
  if (!response.ok) {
    console.log(response.statusText);
    setErrorMessage(["api call error", response.statusText])
    setShowError(true)
    return -1
  }
  else{
    let data = await response.json();
    return data;
  }
}


export default async function getRatedWeapons(access_token, setUserInfo, setWeaponRatings, setPerkInfo, setGunRatings, setSearchQueries, setLoadingMessage, setErrorMessage, setShowError) {
  var t0 = performance.now()
  let activity_types = ["pve", "pvp"]
  getWeaponInfo(setErrorMessage, setShowError, activity_types)
  getMaxScore(activity_types)
  setWeaponRatings(formatWeaponRatings(clone(rated_weapons)))
  let [ranked_rolls, hash_mapping] = await getUserScores(access_token, setUserInfo, rated_weapons, setLoadingMessage, setErrorMessage, setShowError)
  var t1 = performance.now()
  console.log("[!] weapon rating took " + (t1 - t0) + " milliseconds.")

  setSearchQueries(getSearchQueries(ranked_rolls))
  setPerkInfo(hash_mapping)
  setGunRatings(ranked_rolls)
  return "rating complete"
}

function formatWeaponRatings(weapon_ratings){
  let columnNames =  ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]
  for (const [, activity_types] of Object.entries(weapon_ratings)){
    for (const [, activity_type] of Object.entries(activity_types)){
      for (const column of columnNames){
        let temp_array = []
        let max_score = 0
        max_score = activity_type[column].max_score
        delete activity_type[column].max_score
        for (let [perk, score] of Object.entries(activity_type[column])){
          temp_array.push([perk,score])
        }

        temp_array.sort(sortArray)
        for (let score of temp_array){
          // https://stackoverflow.com/questions/35504848/capitalize-hyphenated-names-in-javascript
          var capitalized = score[0].replace(/(^|[\s-])\S/g, function (match) {
              return match.toUpperCase();
          });
          score[0] = capitalized
          score[1] = `${score[1]} / ${max_score}`
        }
        activity_type[column] = temp_array;

      }
    }
  }
  return weapon_ratings
}

function getSearchQueries(ranked_rolls){
  let searchQueries = []
  for (const [hash, activity_types] of Object.entries(ranked_rolls)){
    let temp_dict = {}
    for (const [, activity_type] of Object.entries(activity_types)){
      temp_dict = activity_type.gun_info
    }
    temp_dict["hash"] = hash
    searchQueries.push(temp_dict)
  }
  return searchQueries
}


async function getUserScores(access_token, setUserInfo, rated_weapons, setLoadingMessage, setErrorMessage, setShowError){
  let weapon_hashes = Object.keys(rated_weapons)
  setLoadingMessage("Retrieving membership info")
  let membership_Info_Response = await makeAPICall("/Platform/User/GetMembershipsForCurrentUser/", true, access_token, setErrorMessage, setShowError);
  if (membership_Info_Response === -1){
    setErrorMessage(["Api call error", "unable to retrieve membership info, please try refreshing the page"])
    return
  }
  let membership_id = membership_Info_Response['Response']['destinyMemberships'][0]['membershipId']
  let membership_type = membership_Info_Response['Response']['destinyMemberships'][0]['membershipType']

  console.log("[+] member ID:", membership_id, "   membership type:", membership_type)
  let temp_dict = {}
  temp_dict["membership_id"] = membership_id
  temp_dict["membership_type"] = membership_type
  setUserInfo(temp_dict)

  setLoadingMessage("Retrieving users weapons")
  let profile_Weapons = await getProfileWeapons(access_token, membership_id, membership_type, setErrorMessage, setShowError)

  let rateable_Weapons = filterWeapons(profile_Weapons, weapon_hashes)
  setLoadingMessage("Retrieving unique weapon perks")
  let unique_weapons = await getUniqueWeapons(rateable_Weapons, membership_type, membership_id, access_token, setErrorMessage, setShowError, setLoadingMessage)
  setLoadingMessage("Resolving perk/masterwork hashes")
  let [perk_hash_list, masterwork_List] = await lookupPerks(unique_weapons)
  let [perk_mapping, masterwork_mapping, hash_mapping] = await resolveHashes(perk_hash_list, masterwork_List, access_token, setErrorMessage, setShowError, setLoadingMessage)
  let formatted_rolls = formatRolls(unique_weapons, perk_mapping, masterwork_mapping)
  setLoadingMessage("Rating rolls")
  let rated_rolls = rate_rolls(formatted_rolls, setErrorMessage, setShowError)
  let ranked_rolls = rank_rolls(rated_rolls)

  compare_old_cookies(ranked_rolls)

  console.log("[+] rated rolls: ", ranked_rolls)
  console.log("[+] hash mapping: ", hash_mapping)
  return [ranked_rolls, hash_mapping]
}


function compare_old_cookies(ranked_rolls){
  let unique_hashes = []
  let is_cookie_found = false
  unique_hashes = getCookie("stored_weaons")
  if (unique_hashes !== null){
    is_cookie_found = true
    unique_hashes = JSON.parse(unique_hashes);
  }
  else{
    unique_hashes = []
  }

  for (const [, activity_types] of Object.entries(ranked_rolls)){
    for (const [, activity_type] of Object.entries(activity_types)){
      for (const weapon of activity_type.weapons){
        if (!(unique_hashes.includes(weapon.unique_hash))){
          if (is_cookie_found){
            weapon["new"] = true
          }
          else{
            weapon["new"] = false
          }
          unique_hashes.push(weapon.unique_hash)
        }
        else{
          weapon["new"] = false
        }
      }
    }
  }

  var json_str = JSON.stringify(unique_hashes);
  document.cookie = `stored_weaons=${json_str}; Secure`
}


function rank_rolls(rated_rolls){
  for (const [, activity_types] of Object.entries(rated_rolls)){
    for (const [, activity_type] of Object.entries(activity_types)){
      activity_type.weapons.sort((weapon1, weapon2) => {
        return sortObjects(weapon1, weapon2, "total_score")
      })
    }
  }
  return rated_rolls
}

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


function sortObjects(object1, object2, key) {
  const obj1 = object1[key]
  const obj2 = object2[key]

  if (obj1 < obj2) {
    return 1
  }
  if (obj1 > obj2) {
    return -1
  }
  return 0
}

function sortArray(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? 1 : -1;
    }
}

function rate_rolls(formatted_rolls, setErrorMessage, setShowError){
  let column_names = ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]
  let rated_rolls = {}
  let weapon_errors = []

  for (const [hash, roll_array] of Object.entries(formatted_rolls)) {
    let weapon_count = 1
    rated_rolls[hash] = {}

    for (const roll of roll_array){
      for(const [activity_type, roll_info] of Object.entries(rated_weapons[hash])){
        if (!(activity_type in rated_rolls[hash])){
          rated_rolls[hash][activity_type] = {}
          rated_rolls[hash][activity_type]["gun_info"] = roll_info["info"]
          rated_rolls[hash][activity_type]["weapons"]  = []
        }
        let temp_dict = {}
        temp_dict["max_column_scores"] = {}
        let total_score = 0;
        let unrated_perk_check = Object.assign([],roll["perks"])


        for (const column of column_names){
          temp_dict[column] = {}
          let highest_score = 0;

          // handling undefined masterworks, jank fix as this is not needed to be run for every column
          if (roll["perks"].includes("undefined") && "masterwork" in temp_dict){
            console.log("hit")
            temp_dict["masterwork"]["undefined"] = 0
            const index = unrated_perk_check.indexOf("undefined");
            unrated_perk_check.splice(index, 1);

          }

          for (const perk of roll["perks"]){

            if (perk.toLowerCase() in roll_info[column]){
              temp_dict[column][perk] = roll_info[column][perk.toLowerCase()]
              const index = unrated_perk_check.indexOf(perk);
              unrated_perk_check.splice(index, 1);

              if (roll_info[column][perk.toLowerCase()] > highest_score){
                highest_score = roll_info[column][perk.toLowerCase()]
              }

            }
          }
          total_score += highest_score;
          temp_dict["max_column_scores"][column] = rated_weapons[hash][activity_type][column]["max_score"]
        }
        if (unrated_perk_check.length !== 0){
            weapon_errors.push(rated_weapons[hash][activity_type]["info"]["gun name"])
            console.log("-=-=-=-=-=-=-=-")
            console.log("[!] unable to rate the perks/masterworks ", unrated_perk_check, " for the gun ", rated_weapons[hash][activity_type]["info"]["gun name"])
            console.log("weapon: ",temp_dict)
            console.log("-=-=-=-=-=-=-=-")
        }
        else{
          temp_dict["total_score"] = total_score
          let score_percentage = Math.round((total_score / rated_weapons[hash][activity_type]["info"]["max_score"]) * 100)
          temp_dict["score_percentage"] = score_percentage
          temp_dict["rating"] = getRatingFromScore(score_percentage)
          temp_dict["weapon_count"] = weapon_count
          temp_dict["unique_hash"] = roll["unique_hash"]
          temp_dict["adept"] = roll["adept"]
          weapon_count += 1;
          rated_rolls[hash][activity_type]["weapons"].push(temp_dict)
        }
      }
    }
    if (weapon_errors.length !== 0){
      let error_message = ""
      if (weapon_errors.length === 1){
        error_message = "Unable to rate a roll for the weapon "+
                            weapon_errors+
                            ", this roll will not be shown, message me on discord to get this fixed :)"
      }
      else{
        error_message = "Unable to rate a roll for the weapons "+
                            weapon_errors+
                            ", these rolls will not be shown, message me on discord to get this fixed :)"
      }
      setErrorMessage(["Weapon rating error", error_message])
      setShowError(true)
    }
  }
  return rated_rolls

}

function getRatingFromScore(percentage){
  if (percentage >= 60 && percentage < 82) {
    return ("good")


  }
  else if (percentage >= 82 && percentage < 93){
    return ("great")

  }
  else if (percentage >= 93){
    return ("god")

  }
  else{
    return ("bad")
  }
}

// user side
function formatRolls(unique_weapons, perk_mapping, masterwork_mapping){

  let formatted_rolls = {}
  for (const [perks, key, unique_hash, adept] of unique_weapons){
    if (!(key in formatted_rolls)){
      formatted_rolls[key] = []
    }

    let temp_dict = {}
    temp_dict = {}
    temp_dict["perks"] = []
    let perk_hashes = (perks["reusablePlugs"]["data"]["plugs"])
    for  (let i = 1; i <= 4; i++){
      // for each perk in that column
      if (i in perk_hashes){
        for (const perk of perk_hashes[i]){
          temp_dict["perks"].push(perk_mapping[perk["plugItemHash"]]["name"])
        };
      };
    }
    temp_dict["perks"].push(masterwork_mapping[perks['sockets']['data']['sockets'][7]['plugHash']])
    temp_dict["unique_hash"] = unique_hash

    if (adept === "adept"){
      temp_dict["adept"] = true
    }
    else {
      temp_dict["adept"] = false
    }
    formatted_rolls[key].push(temp_dict)
  }
  return formatted_rolls
}

async function getProfileWeapons(access_token, membership_id, membership_type, setErrorMessage, setShowError){
  let profile_items = await makeAPICall(`/Platform/Destiny2/${membership_type}/Profile/${membership_id}/?components=201, 102, 205`, true, access_token, setErrorMessage, setShowError);
  let all_guns = []
  let vault_Inventory = profile_items['Response']['profileInventory']['data']['items'];
  let character_Inventories = profile_items['Response']['characterInventories']['data'];
  let equipped_Items = profile_items['Response']['characterEquipment']['data'];
  all_guns = vault_Inventory

  // goes through each characters inventory and adds it to the master array
  for (let [, inventory] of Object.entries(character_Inventories)){
    for (let item of inventory['items'])
    {
        all_guns.push(item);
    }
  }
  for (let [, inventory] of Object.entries(equipped_Items)){
    for (let item of inventory['items'])
    {
        all_guns.push(item);
    }
  }
  return all_guns;
}


function filterWeapons(profile_Weapons, weapon_hashes){
  // [adept weapon hash, weapon hash]
  let adept_hash_mapping = []

  // get adept weapons hashes
  for (let [hash, weapon] of Object.entries(rated_weapons)){
    for (let [, activity_type] of Object.entries(weapon)){
      if ("adept hash" in activity_type.info){
        adept_hash_mapping.push([activity_type.info["adept hash"], hash])
      }
      break
    }
  }

  let rateable_Weapons = []
  for (let [, weapon] of Object.entries(profile_Weapons)){
    if (weapon_hashes.includes(weapon["itemHash"].toString())){
      rateable_Weapons.push([weapon['itemHash'].toString(), weapon['itemInstanceId'], "normal"]);
    }
    for (let adept_hash of adept_hash_mapping){
      //console.log(adept_hash[0], weapon["itemHash"])
      if (adept_hash[0] === weapon["itemHash"]){
        rateable_Weapons.push([adept_hash[1].toString(), weapon['itemInstanceId'], "adept"]);
      }
    }
  }
  return rateable_Weapons
}


async function getUniqueWeapons(rateable_Weapons, membership_type, membership_id, access_token, setErrorMessage, setShowError, setLoadingMessage){
  let unique_weapons = []
  let fail_counter = 0
  let perk_number = Object.keys(rateable_Weapons).length
  let error_placeholder = {
    name: "undefined",
    description: "the api was not able to return a description for this perk",
    icon: "/common/destiny2_content/icons/adf0a10698ea63b7f96097106d785ca1.jpg"
  }

  let counter = 0
  await Promise.all(rateable_Weapons.map(async (weapon) => {
    let unique_weapon = await makeAPICall(`/Platform/Destiny2/${membership_type}/Profile/${membership_id}/Item/${weapon[1]}/?components=305,310`, true, access_token, setErrorMessage, setShowError)
    if (unique_weapon !== -1){
      unique_weapons.push([unique_weapon["Response"], weapon[0], weapon[1], weapon[2]])
      counter += 1
      let loading_message = "Retrieving unique weapon perks " + counter + "/" + perk_number;
      setLoadingMessage(loading_message)
    }
    else {
      fail_counter += 1;
    }
    return weapon
  }));

  if (fail_counter !== 0){
    let message = ("unable to load " + fail_counter + " weapon(s)")
    setErrorMessage(["Unique weapon error", message])
    setShowError(true)
  }
  return unique_weapons
}


async function lookupPerks(unique_weapons, setLoadingMessage){
  let perk_hash_list = []
  let masterwork_list = []



  for (const [perks, key] of unique_weapons){
    let perk_hashes = (perks["reusablePlugs"]["data"]["plugs"])

    for  (let i = 1; i <= 4; i++){
      // for each perk in that column
      if ((i in perk_hashes)){
        for (const perk of perk_hashes[i]){
          if (!perk_hash_list.includes(perk["plugItemHash"])){
            perk_hash_list.push(perk["plugItemHash"])
          }
        };
      }
    };
    let masterwork_Hash = perks['sockets']['data']['sockets'][7]['plugHash'];
    if (!masterwork_list.includes(masterwork_Hash)){
      masterwork_list.push(masterwork_Hash)
    }
  }

  return [perk_hash_list, masterwork_list]
}


async function resolveHashes(perk_hash_list, masterwork_List, access_token, setErrorMessage, setShowError, setLoadingMessage){

  let error_placeholder = {
    name: "undefined",
    description: "the api was not able to return a description for this perk",
    icon: "/common/destiny2_content/icons/adf0a10698ea63b7f96097106d785ca1.jpg"
  }

  let perk_mapping = {}
  let masterwork_mapping = {}
  let hash_mapping = {}
  let perk_number = Object.keys(perk_hash_list).length + Object.keys(masterwork_List).length

  let counter = 0
  await Promise.all(perk_hash_list.map(async (hash) => {
    let perk = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${hash}/`, true, access_token, setErrorMessage, setShowError)
    if (perk === -1){
      perk_mapping[hash] = error_placeholder
      hash_mapping[error_placeholder["name"]] = error_placeholder
    }
    else{
      perk_mapping[hash] = perk["Response"]["displayProperties"]
      hash_mapping[perk["Response"]["displayProperties"]["name"]] = perk["Response"]["displayProperties"]
    }
    counter += 1
    let loading_message = "Resolving perk/masterwork hashes " + counter + "/" + perk_number;
    setLoadingMessage(loading_message)
    return hash
  }));

  await Promise.all(masterwork_List.map(async (hash) => {

    let perk = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${hash}/`, true, access_token, setErrorMessage, setShowError)
    if (perk === -1){
      masterwork_mapping[hash] = "undefined";
      hash_mapping["undefined"] = error_placeholder
    }
    else{
      let tmp = perk["Response"]["plug"]["plugCategoryIdentifier"].split('.')

      let masterwork_name =  tmp[tmp.length - 1]
      masterwork_mapping[hash] = masterwork_name;
      hash_mapping[masterwork_name] = perk["Response"]["displayProperties"]
    }

    counter += 1
    let loading_message = "Resolving perk/masterwork hashes " + counter + "/" + perk_number;
    setLoadingMessage(loading_message)
    return hash
  }));
  return[perk_mapping, masterwork_mapping, hash_mapping]
}


// rating side

async function getWeaponInfo(setErrorMessage, setShowError, activity_types) {
  let weapon_hashes = Object.keys(rated_weapons);

  await Promise.all(weapon_hashes.map(async (weapon) => {
    let result = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${weapon}/`, false, "", setErrorMessage, setShowError)
    for (const activity_type of activity_types){
      if (activity_type in rated_weapons[weapon]){
        rated_weapons[weapon][activity_type]["info"]["image"] = result["Response"]
                                                                      ["displayProperties"]
                                                                      ["icon"]
      }
    }
    return weapon
  }));
}

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

function getMaxScore(activity_types){
  let weapon_hashes = Object.keys(rated_weapons);
  let to_rate = ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]
  weapon_hashes.map(async (weapon) => {
    for (const activity_type of activity_types){
      if (activity_type in rated_weapons[weapon]){
        rated_weapons[weapon][activity_type]["info"]["max_score"] = 0

        to_rate.forEach( key => {
          rated_weapons[weapon][activity_type][key]["max_score"] = rated_weapons[weapon][activity_type][key][Object.keys(rated_weapons[weapon][activity_type][key]).reduce((a, b) =>
            rated_weapons[weapon][activity_type][key][a] > rated_weapons[weapon][activity_type][key][b] ? a : b
          )]
          rated_weapons[weapon][activity_type]["info"]["max_score"] += rated_weapons[weapon][activity_type][key]["max_score"]
        });
      }

    }
  })
}
