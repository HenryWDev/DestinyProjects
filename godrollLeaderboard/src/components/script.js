var apiLink = "https://3gmks9uzn3.execute-api.eu-west-2.amazonaws.com/default/Leaderboard"
var api_key = '0a1471885265447e9b9c2d23c50f285c';




async function GetNames(players){
  var temp_mapping = []
  for (var player in players){
    temp_mapping.push([player, players[player].user_info.membership_id])
  };
  await Promise.all(temp_mapping.map(async (player) => {
    let result = await makeAPICall(true, `/Platform/Destiny2/${player[1]}/Profile/${player[0]}/?components=100`)
    players[player[0]].user_info.display_name = result["Response"]["profile"]["data"]["userInfo"]["displayName"]
    return player
  }));
}


// starting function, makes the api call
async function main(){
  // make and send the api call
  var response = await makeAPICall(false, apiLink)

  // gets the related variables into their needed arrays
  var players = response["scores"]
  await GetNames(players)


  // get each unique hash to make the weapons line up on each line
  let weapon_hashes = [];
  for (let player in players){
    for (let weapon_hash in players[player].roll_scores){
      for (let activity_type in players[player].roll_scores[weapon_hash]){
        let stringify_a = JSON.stringify(weapon_hashes);
        let stringify_b = JSON.stringify([weapon_hash, activity_type]);
        if(stringify_a.indexOf(stringify_b) === -1){
          weapon_hashes.push([weapon_hash, activity_type])
        }
      }
    }
  }

  let output = {}

  let player_array = []

  console.log(players)
  for (let [hash, scores] of Object.entries(players)){
    player_array.push([hash, scores])
  }

  player_array.sort(sort_players)

  output["players"] = player_array
  output["weapon_hashes"] = weapon_hashes
  return output
}

function sort_players(a,b){
  if ( a[1].user_info.total_balanced_score === b[1].user_info.total_balanced_score ){
    return 0;
  }
  if ( a[1].user_info.total_balanced_score < b[1].user_info.total_balanced_score ){
    return 1;
  }
  if ( a[1].user_info.total_balanced_score > b[1].user_info.total_balanced_score ){
    return -1;
  }
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

  console.log("result: ", returnedLeaderboardInfo)
  return returnedLeaderboardInfo
}
