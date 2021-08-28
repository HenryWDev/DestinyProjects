var api_key = '0a1471885265447e9b9c2d23c50f285c';
var baseLink = "https://www.bungie.net"
var apiLink = "https://3gmks9uzn3.execute-api.eu-west-2.amazonaws.com/default/Leaderboard"
var sortedParsedInfo = [];
var access_token = null;
var membership_id = null;
var membership_type = null;


// function start
async function main(){

  // get the query string for the url, this is needed to make authenticated calls
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // get the url code needed, avaliable post authentication
  const code = urlParams.get('code');

  // if a code isn't found the users hasn't authenticated yet
  if (code != null){
    var parseableGunsList = [];
    var response;
    var characterInventories

    // hide the alertbox and authentication button
    authenticateButton.style.display = "none"
    alertBox.style.display = "none"

    // show the loading text
    loadingText.innerHTML = "Authenticating..."
    loading.style.display = "block"


    // call authentication function
    await authenticate(code);

    // checks if an access token was successfully retrieved
    if (typeof access_token == 'undefined'){
      // hide the loading bar and display the authenticate button
      loading.style.display = "none"
      authenticateButton.style.display = "block";
      // bring up the alert box
      alertBox.style.display = "block"
      alertBox.innerHTML = "Authentication failed, reauthenticate to try again"
      return;
    }

    loadingText.innerHTML = "Looking in your inventory..."

    // Get membership id and membership type
    // we're looking for a long int for id and a 1-6 int for type
    response = await makeAPICall("/Platform/User/GetMembershipsForCurrentUser/");
    membership_id = response['Response']['destinyMemberships'][0]['membershipId']
    membership_type = response['Response']['destinyMemberships'][0]['membershipType']

    apiCallRolls[membership_id] = {};
    apiCallRolls[membership_id]["membership_info"] = {};
    apiCallRolls[membership_id]["roll_scores"] = {};
    apiCallRolls[membership_id]["membership_info"]["membership_type"] = membership_type;

    // Get the users vault and character inventories
    response = await makeAPICall(`/Platform/Destiny2/${membership_type}/Profile/${membership_id}/?components=201, 102, 205`);

    // get all characters items
    itemArray = response['Response']['profileInventory']['data']['items'];
    characterInventories = response['Response']['characterInventories']['data'];
    equippedItems = response['Response']['characterEquipment']['data'];

    // goes through each characters inventory and adds it to the master array
    for (var [key, inventory] of Object.entries(characterInventories)){
      for (var item of inventory['items'])
      {
          itemArray.push(item);
      }
    }
    for (var [key, inventory] of Object.entries(equippedItems)){
      for (var item of inventory['items'])
      {
          itemArray.push(item);
      }
    }

    // iterates through each item
    for (var item of itemArray) {
      // if the current item matches a hash of a gun we can parse
      if (gunHashList.includes(item['itemHash'])){
        // add this gun info to the array of guns to parse
        parseableGunsList.push([item['itemHash'], item['itemInstanceId']]);
      };
    };

    loadingText.innerHTML = "Rating rolls..."
    var sortedParseableGunsList = [];
    var parsedInfo = [];

    // sorts by gun hash
    sortedParseableGunsList = parseableGunsList.sort(function(a, b) {
      return b[0] - a[0];
    });

    // returns all the weapon information needed to display the rolls
    parsedInfo = await callRollProcessing(parseableGunsList);
    console.log("returned from processing")

    // sort by the guns's score
    sortedParsedInfo =  parsedInfo.sort(function(a, b) {
      return b[5][0] - a[5][0];
    });

    // hide the loading bar
    loading.style.display = "none"
    displayRows()

    // marks when the initial load is finished, so the user can change the number of rows to show
    initialLoadComplete = true;
    console.log("pre api call")
    console.log(apiCallRolls)

    // if the user hasnt got a gun from the current list, give it a score of 0
    for (var hashList in gunHashList){
      if (!(gunHashList[hashList] in apiCallRolls[membership_id]["roll_scores"])){
        console.log("hit")
        console.log(gunHashList[hashList])
        apiCallRolls[membership_id]["roll_scores"][gunHashList[hashList]] = [0, 0];
      }
    }


    tosend = {};
    tosend["scores"] = apiCallRolls;

    // api call to send scores to lambda
    response = await fetch(apiLink, {
      method: 'POST',
      body: JSON.stringify(tosend)
    });
    let data = await response.json();
    console.log(data);

  }

  else {
    authenticateButton.style.display = "block"
    alertBox.style.display = "block"
    alertBox.innerHTML = "Authenticate to allow the website to access your rolls"
  }
}

function displayRows(){
  // used to check how many rows have been added
  var counter = 1;
  // used to determine wether to add a thick of thin line to the row
  var isFirstGun = true;

  var rollScoreDisplay = [0,0,0,0]
  // for each gun hash
  for (var gun of gunHashList){
    // for each processed gun
    for (var gunInfo of sortedParsedInfo) {
      // if the gun hash matches the current gun hash and there arent too many rols being shown
      if (gun == gunInfo[6] && counter <= numOfGuns){
        // display the gun
        addRow(gunInfo[0], gunInfo[1], gunInfo[2] , gunInfo[3], gunInfo[4], gunInfo[5], isFirstGun, rollScoreDisplay);

        // only sends true to the first roll of each gun type
        if (isFirstGun){
          isFirstGun = false;
        }
        counter++;
      }
    }
    // resets the variables for the next gun hash
    isFirstGun = true;
    counter = 1;
  }
}

// used to call roll processing for each gun in parralel
async function callRollProcessing(sortedParseableGunsList){
  parsedInfo = [];
  // goes through each gun
  for (var parseableGun of sortedParseableGunsList) {
      var recieved =  parseUniqueHash(parseableGun[0], parseableGun[1]);
      if (recieved == "bad gun"){
        break;
      }
      else {
        parsedInfo.push(recieved);
      }
  };
  // returns a promise for each function to return a result
  return Promise.all(parsedInfo)
}

// takes the unique gun id and returns the perks, gun info and masterwork info
const parseUniqueHash = async (gunHash, itemInstanceId) => {
  // using the guns unique identifer number, get the guns information
  response = await makeAPICall(`/Platform/Destiny2/${membership_type}/Profile/${membership_id}/Item/${itemInstanceId}/?components=305,310`);

  // get the perks
  var perks = await response['Response']['reusablePlugs']['data']['plugs'];

  //get the masterwork hash
  var masterworkHash = await response['Response']['sockets']['data']['sockets'][7]['plugHash'];


  // get all the non unique info about the gun
  var gunInfo = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${gunHash}/`);

  // get all info about the current masterwork
  var masterworkInfo = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${masterworkHash}/`);

  // for guns from banshee that have no masterwork, set the masterwork name as "No Masterwork"
  if (typeof masterworkInfo['Response'] == 'undefined' || typeof gunInfo['Response'] == 'undefined'){
    var masterworkName = "No masterwork"
  }
  else {
    // get the masterwork name using the plugCategoryIdentifier
    var masterworkName =  masterworkInfo["Response"]["plug"]["plugCategoryIdentifier"];
    var masterworkNameSplit = masterworkName.split('.');
    masterworkName = masterworkNameSplit[masterworkNameSplit.length - 1];
  }

  var masterworkScore = [];
  var rollRating = [];

  // parse the information retrieved
  try{
    [parsedPerks, masterworkScore, rollRating] =  await parsePerks(perks, gunHash, masterworkName)
    return [parsedPerks, gunInfo, masterworkInfo, masterworkName, masterworkScore, rollRating, gunHash]
  } catch {
    return "bad gun"
  }

}

function addRow(parsedPerks, gunInfo, masterworkInfo, masterworkName, masterworkScore, rollRating, isFirstGun, rollScoreDisplay){
  // adds two rows to allow for the max of 2 possible perk slots per column
  var row1 = table.insertRow(-1);
  var row2 = table.insertRow(-1);


  if (colourblindMode){
    var colours = ["godcolourblind", "greatcolourblind", "goodcolourblind", "badcolourblind"]
  }
  else {
    var colours = ["god", "great", "good", "bad"]
  }

  // if the weapon is the first of its type to be displayed, add a thick top border
  if (isFirstGun) {
    row1.classList.add("firstGun")
  }
  else {
    row1.classList.add("toprow");
  }

  // display the gun image
  var cell = row1.insertCell(0);
  insertImage(cell, gunInfo['Response']['displayProperties']['icon'], 'NA');

  // display the gun name
  var cell = row2.insertCell(0);
  cell.innerHTML = gunInfo['Response']['displayProperties']['name'];

  // displays the perks
  var firstColumnUsed = false;
  var column = 1;
  // runs for each perk
  parsedPerks.forEach(item => {
    // if we've moved onto the next column the perk should be displayed
    // on the first row, so the counter is reset and the column is set to the
    // new column
    if (column != item[0])
    {
      // if there was no second perk displayed, add empty cells
      if (firstColumnUsed) {
        var cell = row2.insertCell(2 * (item[0] - 2) + 1);
        var cell = row2.insertCell(2 * (item[0] - 1));
      }
      firstColumnUsed = false;
      column = item[0];
    }
    // if a perk is already in the first row for that column, put the perk
    // in the second column
    if (firstColumnUsed){
      // insert the image to the first column
      var cell = row2.insertCell(2 * (item[0] - 1) + 1);
      insertImage(cell, item[2], 'perkimg');

      // add the relative rarity colours to the background
      cell.classList.add(colours[item[4]]);
      cell.classList.add('imagebox')

      // adds a small top border to seperate the background colour from the perk above it
      cell.classList.add("toprow")
      // insert the perk + score to the second column
      var cell = row2.insertCell(2 * item[0]);
      cell.innerHTML = item[1] +"<br />"+ item[3];

      // as there is no third row the counter can be set to false safely
      firstColumnUsed = false;
    }
    // runs if there is no perk in the first row
    else {
      // insert the image
      var cell = row1.insertCell(2 * (item[0] - 1) + 1);
      insertImage(cell, item[2], 'perkimg')
      cell.classList.add(colours[item[4]]);
      cell.classList.add('imagebox')

      // insert the text + score
      var cell = row1.insertCell(2 * item[0]);
      cell.innerHTML = item[1] +"<br />"+ item[3];

      // sets firstColumnUsed to true so the next loop will be in the bottom column
      firstColumnUsed = true;
    }
  });
  // add the masterwork image
  var cell = row1.insertCell(9);
  if (masterworkName != "No masterwork"){
    insertImage(cell, masterworkInfo['Response']['displayProperties']['icon'], 'NA')
  }


  // add the masterwork backround colour
  var totalRating = (masterworkScore[0] / masterworkScore[1]);
  if (totalRating >= 0 && totalRating < 0.5) {
    cell.classList.add(colours[2])
  }
  else if (totalRating >= 0.5 && totalRating < 0.99){
    cell.classList.add(colours[1])
  }
  else if (totalRating >= 1){
    cell.classList.add(colours[0])
  }
  else {
    cell.classList.add(colours[3])
  }
  cell.classList.add('imagebox')

  // add the masterwork name and score
  var cell = row1.insertCell(10);
  cell.innerHTML = masterworkName + "<br />" + "masterwork" + "<br />" + masterworkScore[0] + "/" + masterworkScore[1];

  // display the total roll score
  var cell = row1.insertCell(11);
  cell.innerHTML = "total score: " + "<br />" + rollRating[0] + "/" + rollRating[1];

  // add background collur based on score

  var totalRating = (rollRating[0] / rollRating[1]);
  if (totalRating >= 0.62 && totalRating < 0.81) {
    cell.classList.add(colours[2])
    rollScoreDisplay[2]++

    if (isFirstGun) {
      apiCallRolls[membership_id]["roll_scores"][gunInfo['Response']['hash']] = [1, rollRating[0]];
    }
  }
  else if (totalRating >= 0.81 && totalRating < 0.93){
    cell.classList.add(colours[1])
    rollScoreDisplay[1]++;

    if (isFirstGun) {
      apiCallRolls[membership_id]["roll_scores"][gunInfo['Response']['hash']] = [3, rollRating[0]];
    }
  }
  else if (totalRating >= 0.93){
    cell.classList.add(colours[0])
    rollScoreDisplay[0]++;

    if (isFirstGun) {
      apiCallRolls[membership_id]["roll_scores"][gunInfo['Response']['hash']] = [5, rollRating[0]];
    }
  }
  else {
    cell.classList.add(colours[3])
    rollScoreDisplay[3]++;

    if (isFirstGun) {
      apiCallRolls[membership_id]["roll_scores"][gunInfo['Response']['hash']] = [0, rollRating[0]];
    }
  }

  displayNoOfGodrolls.innerHTML = rollScoreDisplay[0] + " God rolls | " + rollScoreDisplay[1] + " Great rolls | " + rollScoreDisplay[2] + " Good rolls | " + rollScoreDisplay[3] + " Bad rolls"

  cell.classList.add('imagebox')

}


// takes the data returned by the api and the gun hash
// and returned a processed array with perk scores
async function parsePerks(perks, gunHash, masterworkName){
  var parsedPerks = [];

  // for each perk column
  for  (let i = 1; i <= 4; i++){
    // for each perk in that column
    for (const perk of perks[i]){
       // get the perk name from its hash
       response = await makeAPICall(`/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${perk['plugItemHash']}/`);


       // add the returned name and image to parsedPerks to be returned
       parsedPerks.push([i, response['Response']['displayProperties']['name'], response['Response']['displayProperties']['icon']])
     };
    };

  // send the processed array to get the point scores added
  // returns the sent array with point values added to each row
  var masterworkScore = [0,0];
  var rollRating = [0,0];
  // get the scores for each perk
  [parsedPerks, masterworkScore, rollRating] = await getScores(parsedPerks, gunHash, masterworkName);

  return [parsedPerks, masterworkScore, rollRating];
}

// takes an array containing api processed perks and the gun hash
async function getScores(perks, gunHash, masterworkName){
  var perk1 = [];
  var perk2 = [];
  var perk3 = [];
  var perk4 = [];
  var masterwork = [];
  var masterworkScore = [0,0];
  var maxScores = [0,0,0,0,0];
  var maxUserPerkScore = [0,0,0,0,0];
  var maxRollScore = 0;

  // fetches the locally stored score csv's using the passed gun hash
  response = await fetch(`./rollInfo/${gunHash}.csv`)
  let data = await response.text();


  // splits the csv by row
  var allRows = data.split(/\r?\n|\r/);

  // for each row of the csv
  for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
    // splits the row by commas
    var rowCells = allRows[singleRow].split(',');

    // gets the max possible score for the roll
    if (singleRow == 1) {
      maxRollScore = rowCells[10];
    }

    // goes through each row, adding the perk name and score to arrays
    if (rowCells[0] != ""  && rowCells[0] != undefined){
      perk1.push([rowCells[0], rowCells[1]])
      if (rowCells[1] > maxScores[0]){
        maxScores[0] = rowCells[1]
      }
    }
    if (rowCells[2] != "" && rowCells[2] != undefined){
      perk2.push([rowCells[2], rowCells[3]])
      if (rowCells[3] > maxScores[1]){
        maxScores[1] = rowCells[3]
      }
    }
    if (rowCells[4] != "" &&  rowCells[4] != undefined){
      perk3.push([rowCells[4], rowCells[5]])
      if (rowCells[5] > maxScores[2]){
        maxScores[2] = rowCells[5]
      }
    }
    if (rowCells[6] != "" &&  rowCells[6] != undefined){
      perk4.push([rowCells[6], rowCells[7]])
      if (rowCells[7] > maxScores[3]){
        maxScores[3] = rowCells[7]
      }
    }
    if (rowCells[8] != "" &&  rowCells[8] != undefined){
      masterwork.push([rowCells[8], rowCells[9]])
      if (rowCells[9] > maxScores[4]){
        maxScores[4] = rowCells[9]
      }
    }
  }

  // TODO: can you break out of loops early here without breaking it?

  // checks each perk against the name and scores in the csv
  perks.forEach(perk => {
    if(perk[0] == 1){
      perk1.forEach(item => {
        // checks the perk name against the csv perk names
        if (item[0].toLowerCase().trim() == perk[1].toLowerCase().trim()){
          perk.push(item[1]);
          perk.push(getRating(item[1], maxScores[0]));

          // if the score for this perk column is larger than the last one, update the max score
          if (item[1] > maxUserPerkScore[0]){
            maxUserPerkScore[0] = item[1];
          }
        }
      });
    }
    if(perk[0] == 2){
      perk2.forEach(item => {
        if (item[0].toLowerCase().trim() == perk[1].toLowerCase().trim()){
          perk.push(item[1]);
          perk.push(getRating(item[1], maxScores[1]));

          if (item[1] > maxUserPerkScore[1]){
            maxUserPerkScore[1] = item[1];
          }
        }
      });
    }
    if(perk[0] == 3){
      perk3.forEach(item => {
        if (item[0].toLowerCase().trim() == perk[1].toLowerCase().trim()){
          perk.push(item[1]);
          perk.push(getRating(item[1], maxScores[2]));

          if (item[1] > maxUserPerkScore[2]){
            maxUserPerkScore[2] = item[1];
          }
        }
      });
    }
    if(perk[0] == 4){
      perk4.forEach(item => {
        if (item[0].toLowerCase().trim() == perk[1].toLowerCase().trim()){
          perk.push(item[1]);
          perk.push(getRating(item[1], maxScores[3]));

          if (item[1] > maxUserPerkScore[3]){
            maxUserPerkScore[3] = item[1];
          }
        }
      });
    }
  });

  // gets the masterwork score
  var counter1 = 0;
  masterwork.forEach(item => {
    if (item[0].toLowerCase().trim() == masterworkName.toLowerCase().trim()){
      masterworkScore[0] = item[1];
      masterworkScore[1] = maxScores[4];

      maxUserPerkScore[4] = item[1];

      counter1 = 1;
    }
    // checks for dud banchee roll
    if (masterworkName == "No masterwork")
    {
      masterworkScore[0] = 0;
      masterworkScore[1] = maxScores[4];
    }
  });
  return [perks, masterworkScore, [maxUserPerkScore.reduce((a,b) => parseInt(a) + parseInt(b), 0), maxRollScore]];
}

// takes score and max score, returns the rating
function getRating(score, maxScore){

  if (score == maxScore){
    return(0);
  }
  else if (score == maxScore - 1){
    return(1);
  }
  else if (score == maxScore - 2){
    return(2);
  }
  else {
    return(3)
  }
}

// adds the passed image to be added to the passed cell
function insertImage(cell, image, addClass) {
  var img = document.createElement('img');
  img.src = baseLink + image;
  cell.appendChild(img);
   if (addClass != 'NA'){
     img.classList.add(addClass);
   }
}

// used for all generic api calls
async function makeAPICall(link) {
  myHeaders = new Headers();
  myHeaders.append('X-API-Key', api_key)
  myHeaders.append('Authorization', "Bearer " + access_token)

  let response = await fetch(baseLink + link, {
    method: 'GET',
    headers: myHeaders
  });
  let data = await response.json();
  return data;
}

// called once to authenticate the program and get the neccessary tokens
async function authenticate(code){
  link = "/Platform/App/OAuth/Token/"
  myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  let response = await fetch(baseLink + link, {
    method: 'POST',
    headers: myHeaders,
    body: `client_id=36832&grant_type=authorization_code&code=${code}`
  });
  let data = await response.json();

  // this var is needed for all authenticated calls
  access_token = data['access_token'];
  return data;

}
