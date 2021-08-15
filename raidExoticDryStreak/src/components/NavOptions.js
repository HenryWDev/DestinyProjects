import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav'



const NavOptions = ({raidInfo, selectRaid}) => {

  return (
    <div>
      <Nav fill variant="tabs" defaultActiveKey="/home">
        {raidInfo.map(item => (
          <Nav.Item key={item.id} onClick={() => selectRaid(item.id)}>
            <Nav.Link  eventKey={`link-${item.id}`}>{item.name}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  )
}

export default NavOptions;
