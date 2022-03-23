

export default async function uploadScores(gunRatings, userInfo, perkInfo) {
  let columnNames =  ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]
  var apiLink = "https://3gmks9uzn3.execute-api.eu-west-2.amazonaws.com/default/Leaderboard"
  let rating_map = {"god": 5, "great": 3, "good": 1, "bad": 0}
  let total_balanced_score = 0
  let dict_to_upload = {}
  dict_to_upload[userInfo.membership_id] = {}
  dict_to_upload[userInfo.membership_id]["user_info"] = {}
  dict_to_upload[userInfo.membership_id]["roll_scores"] = {}
  dict_to_upload[userInfo.membership_id]["user_info"]["membership_id"] = userInfo.membership_type

  for (let [weapon_hash, activity_types] of Object.entries(gunRatings)){
    for (let [activity_type, weapon_info] of Object.entries(activity_types)){
      if (weapon_info.gun_info["current season"]){
        if (!(weapon_hash in dict_to_upload[userInfo.membership_id]["roll_scores"])){
          dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash] = {}
        }
        dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type] = {}
        dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type]["balanced_score"]
        =  gunRatings[weapon_hash][activity_type].weapons[0].score_percentage
        total_balanced_score += gunRatings[weapon_hash][activity_type].weapons[0].score_percentage

        dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type]["score"]
        =  rating_map[gunRatings[weapon_hash][activity_type].weapons[0].rating]

        dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type]["weapon_info"]
        = gunRatings[weapon_hash][activity_type].gun_info

        dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type]["icons"] = {}
        for (let column of columnNames){
          dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type]["icons"][column] = []
          for (const [key, score] of Object.entries(gunRatings[weapon_hash][activity_type].weapons[0][column])){
            dict_to_upload[userInfo.membership_id]["roll_scores"][weapon_hash][activity_type]["icons"][column].push(
              perkInfo[key].icon
            )
          }
        }
      }
    }
  }
  dict_to_upload[userInfo.membership_id]["user_info"]["total_balanced_score"] = total_balanced_score

  let formatted_dict = {}
  formatted_dict["scores"] = dict_to_upload

  let response = await fetch(apiLink, {
    method: 'POST',
    body: JSON.stringify(formatted_dict)
  });
  let data = await response.json();
  if (response.ok) {
    console.log("[+] Leaderboard Upload: ", response.statusText);
  }
  else{
    console.log("[!] Leaderboard error: ", response.statusText);
  }
  console.log("[+] Leaderboard: ", data);
}

// "player hash": {
//   "user info": {
//     "membership_type": int
//     "total_balanced_score": int
//   },
//   "roll_scores": {
//     "roll hash": {
//       "activity type": {
//         "score": int(0,1,3,5),
//
//       }
//     }
//   }
// }
