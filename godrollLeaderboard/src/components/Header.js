import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'

import './style.css'

const Header = ({changeCBMode, changeDisplayMode, SelectLeaderboard}) => {

  return(

    <Navbar fill="true" bg="dark" variant="dark" fixed="top">
      <div className="container-fluid">
        <Navbar.Brand href="/">Godroll Leaderboard</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>

        </Nav>

        <Nav variant="pills" className="me-auto" defaultActiveKey="current">
          <Nav.Item>
            <Nav.Link eventKey="current" onClick={() => SelectLeaderboard("current")}>Current</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="season1" onClick={() => SelectLeaderboard("season1")}>Season 1</Nav.Link>
          </Nav.Item>
        </Nav>


        <div className='align-middle'>
          <Form.Check
            className="align-middle white"
            inline
            label="Display all scores"
            name="group1"
            type='switch'
            id='2'
            onClick={changeDisplayMode}
          />
          <Form.Check
            className="align-middle white"
            inline
            label="Colourblind mode"
            name="group1"
            type='switch'
            id='1'
            onClick={changeCBMode}
          />
        </div>
      </div>
    </Navbar>

  );
}

export default Header;
