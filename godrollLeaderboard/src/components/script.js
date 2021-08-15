var apiLink = "https://3gmks9uzn3.execute-api.eu-west-2.amazonaws.com/default/Leaderboard"

var api_key = '0a1471885265447e9b9c2d23c50f285c';


var gunInfo = {}
var displayNames = {}
var hashList = []
var ordered_players = []




async function loadInfo(hashList, players){
  await Promise.all(hashList.map(async (hash) => {
    let result = await (makeAPICall(true, `/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${hash}/`));
    gunInfo[hash] = result["Response"]["displayProperties"]
  }));

  var temp_mapping = []
  for (var player in players){
    temp_mapping.push([player, players[player]["membership_info"]["membership_type"]])
  };

  await Promise.all(temp_mapping.map(async (player) => {
    let result = await makeAPICall(true, `/Platform/Destiny2/${player[1]}/Profile/${player[0]}/?components=100`)
    displayNames[player[0]] = result["Response"]["profile"]["data"]["userInfo"]["displayName"]
    return player
  }));

}


// starting function, makes the api call
async function main(){
  // make and send the api call
  var response = await makeAPICall(false, apiLink)

  // gets the related variables into their needed arrays
  var players = response["scores"]

  for(var rolls in players){
      for(var hash in players[rolls]["roll_scores"]){
        hashList.push(hash);
      }
      break;
  }

  await loadInfo(hashList, players);

  // loads each row one at a time
  for(var player in players){
    var total_score = 0;

    for (var roll in players[player]["roll_scores"])
    {
      total_score += players[player]["roll_scores"][roll];
    }
    ordered_players.push({"total_score": total_score, 'player_name': displayNames[player], "roll_scores": players[player]["roll_scores"], "player_hash": player})
  }



  return ordered_players

}


async function makeAPICall(bungieCall, link) {
  if (bungieCall){
    var myHeaders = new Headers();
    myHeaders.append('X-API-Key', api_key)
    let baseLink = "https://www.bungie.net"
    link = baseLink.concat(link);
  }

  let response = await fetch(link, {
    method: 'GET',
    headers: myHeaders
  });
  let data = await response.json();
  return data;
}


export default async function getLeaderboard(){
  let returnedLeaderboardInfo = await main()
  returnedLeaderboardInfo.sort(function(first, second) {
    return second.total_score - first.total_score;
  });
  console.log(returnedLeaderboardInfo)
  let returnedGunInfo = gunInfo
  return [returnedLeaderboardInfo, returnedGunInfo]
}
