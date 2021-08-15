import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const CharacterDisplay = ({characterInfo}) => {
  console.log(characterInfo)


  return (
    <Row className="characterDisplay">
      {Object.entries(characterInfo).map(([character, info]) => (
        <Col key={character}>
          <h3>{info.class}</h3>
          <img src={'https://www.bungie.net/' + info["emblem"]} alt="emblem" className="img-fluid" />
        </Col>
      ))}
    </Row>
  )
}

export default CharacterDisplay
