/* Expansion work, include ordeals and their ground modifiers? */

// hide this before upload
key = '71907afa55774a48a57855b63b403980'
modifiers = []


function start() {
  getMilestones('https://www.bungie.net/Platform/Destiny2/Milestones/')
    .then(data => {
      modifiers = data['Response']['1437935813']['activities']['0']['modifierHashes']
      process();
    })
    .catch(e => {
      console.log(e.message)
    })
    setTimeout(() => console.log("hello"), 0)

};



function process() {
  isGroundedOn = false;
  x = 3;
  modifiers.forEach(item => {
    getMilestones('https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityModifierDefinition/'+ item +'/')
    .then (data => {
        console.log(item)
        console.log(data)
        console.log(data['Response']['displayProperties']['description'])

        document.getElementById('modifier' + x).src="https://www.bungie.net"+ data['Response']['displayProperties']['icon']
        document.getElementById('modifier' + x + "title").innerHTML = data['Response']['displayProperties']['name']
        document.getElementById('modifier' + x + "description").innerHTML = data['Response']['displayProperties']['description']

        x -= 1;



        if (data['Response']['displayProperties']['name'] == "Grounded") {
          document.getElementById("text2").innerHTML = "is";
          document.getElementById("text4").innerHTML = ":(";
        }

        if (x == 0) {
          showScreen()
        }
    })

    .catch(e => {
      console.log("error" + e.message)
    })
  })
};

async function showScreen() {
  console.log("making icons visible")
  document.getElementById("text1").classList.add("visible");
  await sleep(500);
  document.getElementById("text2").classList.add("visible");
  await sleep(500);
  document.getElementById("text3").classList.add("visible");
  await sleep(500);
  document.getElementById("text4").classList.add("visible");
  await sleep(100);
  document.getElementById("description1").classList.add("visible");
  document.getElementById("imgcontain1").classList.add("visible");
  await sleep(100);
  document.getElementById("description2").classList.add("visible");
  document.getElementById("imgcontain2").classList.add("visible");
  await sleep(100);
  document.getElementById("description3").classList.add("visible");
  document.getElementById("imgcontain3").classList.add("visible");
  console.log("finished!")
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getMilestones(link) {

  let response = await fetch(link, {
    headers: {
      'X-API-Key': key
    }})
  let data = await response.json()
  return data;
}


start()
