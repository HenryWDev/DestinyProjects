import Spinner from 'react-bootstrap/Spinner'

const LoadingView = ({loadingMessage}) => {
  return (
    <div  className="d-grid gap-2" style={{ "paddingTop": 20 }}>
      <Spinner animation="border" className="mx-auto"  variant="info" role="status">
        <span className="visually-hidden" >Loading...</span>

      </Spinner>
      <p className="mx-auto">{loadingMessage}</p>
    </div>
  )
}

export default LoadingView
