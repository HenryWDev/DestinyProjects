

class activityDates {
  constructor(membershipID, membershipType, api_key){
    this.membershipID = membershipID;
    this.membershipType = membershipType;
    this.characters = [];
    this.api_key = api_key
  }

  async getCharacters() {
    let characters = [];
    let result = await makeAPICall(`/Platform/Destiny2/${this.membershipType}/Profile/${this.membershipID}/?components=200`, this.api_key);
    for (const key of Object.entries(result["Response"]["characters"]["data"])){
      this.characters.push(key[0])
    }
  }

  async getActivities() {
    // makes the call to get the activity list for all raids for each character
    var printPrefix = "[activityDates.getActivities] [+] "
    var counter = 0;
    var activityList = {};
    console.log(printPrefix, "calling activities for each character...")
    for (let character of this.characters){
      console.log(printPrefix, "calling activities for character", character)
      counter = 0

      let tempURL = `/Platform/Destiny2/${this.membershipType}/Account/${this.membershipID}/Character/${character}/Stats/Activities/?mode=4&count=250&page=0`;
      let result = await makeAPICall(tempURL, this.api_key);
      activityList[character] = result["Response"]["activities"];

      while (Object.keys(activityList[character]).length === 250){
        console.log(printPrefix, "250 activities recieved for ", character, ", recalling...")

        counter++;

        result = await makeAPICall(`/Platform/Destiny2/${this.membershipType}/Account/${this.membershipID}/Character/${character}/Stats/Activities/?mode=4&count=250&page=${counter}`, this.api_key);

        let current_array = activityList[character];
        let new_array = result["Response"]["activities"];
        new_array = current_array.concat(new_array);

        activityList[character] = new_array;
      }
    }
    console.log(printPrefix, "calling complete")
    return activityList
  }



  // 1700 UTC is reset, UTC = Z
  getDates(activityList, raidHash){
    var printPrefix = "[activityDates.getDates] [+] "
    console.log(printPrefix, "calculating dates for hashes ", raidHash)

    var lastest_Raid = new Date(activityList[this.characters[0]][0]["period"]);
    var oldest_Raid = new Date(activityList[this.characters[0]][0]["period"]);

    // get the oldest raid completion date for a raid hash
    for (var response in activityList){
      if (new Date(activityList[response][0]["period"]) > lastest_Raid){
        lastest_Raid = new Date(activityList[response][0]["period"])
      }
      for (var activity of activityList[response]){
        if (raidHash.includes(activity["activityDetails"]["referenceId"]) && activity["values"]["completed"]["basic"]["value"] === 1){
          if (new Date(activity["period"]) < oldest_Raid){
            oldest_Raid = (new Date(activity["period"]))
          }
        }
      }
    }

    console.log(printPrefix, "oldest_Raid for hash ", raidHash, oldest_Raid)

    console.log(oldest_Raid.getDay())
    if (oldest_Raid.getDay() === 2){
      var oldest_Weekly_Reset = new Date(oldest_Raid.getFullYear(), oldest_Raid.getMonth(), oldest_Raid.getDate() - oldest_Raid.getDay() - (oldest_Raid.getDay() === 0 ? -6:2));
      console.log(printPrefix, "Raid completion on reset day")
    }
    else{
      var oldest_Weekly_Reset = oldest_Raid
    }
    oldest_Weekly_Reset.setHours(17)

    var uniqueHashes = []
    var sorted_weekly_completions = {}
    var weekly_raid_found = false;
    var weeklyReset = oldest_Weekly_Reset

    while (weeklyReset < lastest_Raid){
      let nextWeek = new Date(weeklyReset.getFullYear(), weeklyReset.getMonth(), weeklyReset.getDate() + 7);
      nextWeek.setHours(17);

      sorted_weekly_completions[weeklyReset] = []
      for (var character in activityList){
        weekly_raid_found = false;
        sorted_weekly_completions[weeklyReset][character] = {}

        for (activity of activityList[character]){
          if (!(uniqueHashes.includes(activity["activityDetails"]["referenceId"]))){
            uniqueHashes.push(activity["activityDetails"]["referenceId"])
          }
          if (raidHash.includes(activity["activityDetails"]["referenceId"]) && activity["values"]["completed"]["basic"]["value"] === 1){
            var tempDate = new Date(activity["period"]);

            if (tempDate > weeklyReset && tempDate < nextWeek){
              sorted_weekly_completions[weeklyReset][character]["completed"] = true;
              sorted_weekly_completions[weeklyReset][character]["info"] = {};
              sorted_weekly_completions[weeklyReset][character]["info"]["Date"] = tempDate
              weekly_raid_found = true
              break;
            }
          }
        }
        if (!(weekly_raid_found)){
          sorted_weekly_completions[weeklyReset][character]["completed"] = false;
        }
      }
      weeklyReset = nextWeek;
    }

    console.log(printPrefix, "sorting finished for hash ", raidHash)
    return sorted_weekly_completions
  }

  async getCharacterInfo(){
    var printPrefix = "[activityDates.getCharacterInfo] [+] "
    let classHashLink = {
      "2271682572": "Warlock",
      "3655393761": "Titan",
      "671679327": "Hunter"
    }
    let characterInfo = {}
    for (let character of this.characters){
      let result = await makeAPICall(`/Platform/Destiny2/${this.membershipType}/Profile/${this.membershipID}/Character/${character}/?components=200`, this.api_key);
      console.log(result)
      characterInfo[character] = {}
      characterInfo[character]["emblem"] = result["Response"]["character"]["data"]["emblemBackgroundPath"]

      characterInfo[character]["class"] = classHashLink[result["Response"]["character"]["data"]["classHash"]]
    }
    console.log(printPrefix, "character Info: " ,characterInfo)
    return characterInfo
  }

  async  getUniqueWeaponStats() {
    let uniqueWeaponsStats = {}
    for (let character of this.characters){
      let result = await makeAPICall(`/Platform/Destiny2/${this.membershipType}/Account/${this.membershipID}/Character/${character}/Stats/UniqueWeapons/`, this.api_key)
      uniqueWeaponsStats[character] = result["Response"]["weapons"]
    }
    return uniqueWeaponsStats
  }

  async getGunImageFromHash(gunHash, gunInfo) {
    let response = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${gunHash}/`, this.api_key)
    gunInfo["icon"] = response["Response"]["displayProperties"]["icon"]
  }

  async checkGunHash(gunHash, uniqueWeaponsStats, gunInfo) {
    for (let character of this.characters){
      for (const val of Object.entries(uniqueWeaponsStats[character])){
        if (val[1]["referenceId"].toString() === gunHash){
          gunInfo["owned"] = true;
          return gunInfo
        }
      }
    }

    gunInfo["owned"] = false;
    return gunInfo
  }
}

async function makeAPICall(link, api_key) {
  var myHeaders = new Headers();
  myHeaders.append('X-API-Key', api_key)
  var baseLink = "https://www.bungie.net"
  link = baseLink.concat(link);

  let response = await fetch(link, {
    method: 'GET',
    headers: myHeaders
  });
  let data = await response.json();
  return data;
}

async function parseGunHash(gunHash, uniqueWeaponsStats, activityInfo) {
  let gunInfo = {}
  await activityInfo.checkGunHash(gunHash, uniqueWeaponsStats, gunInfo)
  await activityInfo.getGunImageFromHash(gunHash, gunInfo)
  return gunInfo
}

// /Platform/Destiny2/1/Account/4611686018429877076/Character/2305843009264131944/Stats/UniqueWeapons/

export default async function main(raidInfo, setRaidInfo, setIsLoaded, membershipInfo, api_key, setCharacterInfo){

  let activityInfo = new activityDates(membershipInfo.membershipID, membershipInfo.membershipType, api_key)

  await activityInfo.getCharacters()

  var activityList = await activityInfo.getActivities()


  // move this await to not block getting the gun info
  setCharacterInfo(await activityInfo.getCharacterInfo())

  let uniqueWeaponsStats = await activityInfo.getUniqueWeaponStats()



  for (let raid of raidInfo) {
    raid["gunInfo"] = await parseGunHash(raid["gunHash"], uniqueWeaponsStats, activityInfo)
    raid["completions"] = activityInfo.getDates(activityList, raid["hash"])
  }
  setIsLoaded(true)
}
