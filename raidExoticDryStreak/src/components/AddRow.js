import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const AddRow = ({startingWeek, displayData}) => {
  //console.log(displayData)
  //console.log(displayData.length)
  let d = new Date(startingWeek)

  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

  return (
    <div className="rowContainer">
      <Row className='row' key={startingWeek + "header"}>
       <h3>Week start: {`${da}-${mo}-${ye}`} </h3>

      </Row>
      <Row key={startingWeek + "footer"}>

        {Object.entries(displayData).map(([character, info]) => (
          <Col className='column' key={startingWeek+character}>
          <p className={info.completed ? "column-green" : "column-red"}>
          {info.completed ? "Completed" : "Not Completed"  } </p>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default AddRow
