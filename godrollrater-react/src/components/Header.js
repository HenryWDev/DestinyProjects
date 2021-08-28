import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'

import './style.css'

const Header = (props) => {

  return(

    <Navbar fill="true" bg="dark" variant="dark" fixed="top">
      <div className="container-fluid">
        <Navbar.Brand href="/">Godroll Rater</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/">Info</Nav.Link>
        </Nav>


        <div className='align-middle'>
          <Form.Check
            className="align-middle white"
            inline
            label="Debug mode"
            name="group1"
            type='switch'
            id='2'
          />
          <Form.Check
            className="align-middle white"
            inline
            label="Colourblind mode"
            name="group1"
            type='switch'
            id='1'
          />
        </div>
      </div>
    </Navbar>

  );
}

export default Header;
