let printMessage = "[Authenticate]"

export default async function Authenticate(auth_code) {


  let baseLink = "https://www.bungie.net"
  let link = "/Platform/App/OAuth/Token/"
  // local
  // let client_id = "32984"

  //live
  let client_id = "36832"

  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  let response = await fetch(baseLink + link, {
    method: 'POST',
    headers: myHeaders,
    body: `client_id=${client_id}&grant_type=authorization_code&code=${auth_code}`
  })

  if (!response.ok) {
    console.log(printMessage,"[!]",response.statusText);
    return -1;
  }
  let data = await response.json();
  var expiry_time = new Date();
  expiry_time.setSeconds(expiry_time.getSeconds() + data.expires_in);
  document.cookie = `access_token=${data.access_token}; expires=${expiry_time}; Secure`;
  let access_token = data.access_token;
  console.log(printMessage,"[+]","Authentication successful");
  return access_token;
}
