// https://www.bungie.net/en/OAuth/Authorize?client_id=36832&response_type=code
import Button from 'react-bootstrap/Button'

// local

// const AuthenticateButton = (props) => {
//   return (
//     <div className="d-grid gap-2" style={{ "paddingTop": 20 }}>
//       <Button size="lg" className="mx-auto" variant="primary" href="https://www.bungie.net/en/OAuth/Authorize?client_id=32984&response_type=code" >Authenticate</Button>
//     </div>
//   )
// }
// export default AuthenticateButton

// live

const AuthenticateButton = (props) => {
  return (
    <div className="d-grid gap-2" style={{ "paddingTop": 20 }}>
      <Button size="lg" className="mx-auto" variant="primary" href="https://www.bungie.net/en/OAuth/Authorize?client_id=36832&response_type=code" >Authenticate</Button>
    </div>
  )
}
export default AuthenticateButton
