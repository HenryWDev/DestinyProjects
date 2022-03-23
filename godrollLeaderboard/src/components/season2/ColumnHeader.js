
const ColumnHeader = ({devMode, gunInfo}) => {
  console.log("here:", gunInfo)
  console.log("2", devMode)
  return (
    <thead>
      <tr>
        <th key="headerName">
          Name
        </th>

        <th key="headerTotalPoints">
          Total Points
        </th>

        {devMode &&
          <th key="headerDevMode">
            Dev Info
          </th>
        }

        {Object.entries(gunInfo).map(([key, info]) => (
          <th key={key}>
            <p>{info.name}</p>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default ColumnHeader


//  <img className="align-bottom" src={'https://www.bungie.net/' + info["icon"]} alt="emblem" className="img-fluid" />
