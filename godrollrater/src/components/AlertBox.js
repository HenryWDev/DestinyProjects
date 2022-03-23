import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'

const AlertBox = ({show, setShow, errorMessage}) => {

  return(
      <Container>
        <Alert variant="danger" show={show} className="fixed-bottom text-center" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>{errorMessage[0]}</Alert.Heading>
          <p className="AlertMessage">
            {errorMessage[1]}
          </p>
        </Alert>
      </Container>
    );

}


export default AlertBox
