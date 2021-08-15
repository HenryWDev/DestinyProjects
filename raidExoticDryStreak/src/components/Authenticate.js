import Button from 'react-bootstrap/Button'


const Authenticate = (UserInfo) => {

  const StartAuthenticate = () => {

  }
  // https://www.bungie.net/en/OAuth/Authorize?client_id=37289&response_type=code
  return (
    <div>
      <Button variant="primary" onClick={StartAuthenticate} >Authenticate</Button>
    </div>
  )
}

export default Authenticate
