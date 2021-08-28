import './style.css'


const ColumnBody = ({devMode, colourblindMode, leaderboardInfo, gunInfo, permittedPlayers, displayAllScores}) => {


  const colourMapping = {
    0: "bad",
    1: "good",
    3: "great",
    5: "god"
  }


  const renderElement = (info) => {
    if (permittedPlayers.indexOf(String(info["player_hash"])) !== -1
        || displayAllScores){
      return (
        <tr key={info.player_name}>
          <td key={info.player_name + "name"}>{info.player_name}</td>
          <td key={info.player_name + "score"}>{info.total_score}</td>
          {devMode && <td key={info.player_name + "devInfo"}>
            TRS: {info.total_roll_score} <br />
            hash: {info.player_hash}

          </td>}
          {Object.entries(info.roll_scores).map(([key2, score]) => (
            <td key={info.player_name + key2}className={`${colourMapping[score]}${colourblindMode  ? 'colourblind' : ''}`} >
              <img alt="gun :)" src={'https://www.bungie.net/'+ gunInfo[key2]["icon"]}></img>
            </td>

          ))}
        </tr>
      )
    }
  }

  return (
    <tbody>
    {Object.entries(leaderboardInfo).map(([key, info]) => (

      renderElement(info)

    ))}

    </tbody>
  )
}

export default ColumnBody
