
import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Table from 'react-bootstrap/Table'
import { createTheme, ThemeProvider } from '@mui/material/styles';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ColumnBody = ({devMode, colourblindMode, leaderboardInfo, gunInfo, permittedPlayers, displayAllScores}) => {

  const colourMapping = {
    0: "bad",
    1: "good",
    3: "great",
    5: "god"
  }

  const columnOrder = ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]


  const renderElement = (roll_scores, user_info, user_hash, weapon_hashes, colourblindMode) => {
    if (permittedPlayers.indexOf(user_hash) !== -1
        || displayAllScores){
      return (
        <tr key={user_info.display_name}>
          <td key={user_info.display_name + "name"}>{user_info.display_name}</td>
          <td key={user_info.display_name + "score"}>{user_info.total_balanced_score}</td>
          {devMode && <td key={user_info.display_name + "devInfo"}>
            hash: {user_hash}

          </td>}

          {Object.entries(weapon_hashes).map(([, weapon_info]) => {
            return(
              displayRow(weapon_info, roll_scores, colourblindMode)
            )
          })}
        </tr>
      )
    }
  }

  const displayRow = (weapon_info, roll_scores, colourblindMode) => {
    if (weapon_info[0] in roll_scores){
      if (weapon_info[1] in roll_scores[weapon_info[0]]){
        return(
          <ThemeProvider theme={darkTheme}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 100, hide: 200 }}
                overlay={
                  <Popover>
                    <Popover.Header
                      style={{"background":"rgb(35,35,41)", "color":"white", "width":"400px", "border-bottom": "solid 1px #ffffff"}}
                      className="tooltipText"
                      as="h3">
                      {roll_scores[weapon_info[0]][weapon_info[1]].weapon_info["gun name"] + " - " + weapon_info[1] + " - " + roll_scores[weapon_info[0]][weapon_info[1]].balanced_score}
                    </Popover.Header>
                    <Popover.Body style={{"background":"rgb(35,35,41)", "width":"400px"}} >
                      <Table>
                        <tbody>
                          <tr>
                            {
                              Object.entries(columnOrder).map(([, column]) => {
                                return(
                                  <td style={{"border-bottom": "solid 0px"}}>
                                  {
                                    Object.entries(roll_scores[weapon_info[0]][weapon_info[1]].icons[column]).map(([, img_link]) => {
                                      return(
                                        <img className="popoverImage" src={"https://www.bungie.net" + img_link} />
                                      )
                                    })
                                  }
                                </td>
                                )
                              })
                            }
                          </tr>
                        </tbody>
                      </Table>
                    </Popover.Body>
                  </Popover>
                }
              >
              <td className={colourblindMode ? colourMapping[roll_scores[weapon_info[0]][weapon_info[1]].score] + "colourblind": colourMapping[roll_scores[weapon_info[0]][weapon_info[1]].score]}>
                <img className="imagebox" alt="gun :)" src={'https://www.bungie.net/'+ roll_scores[weapon_info[0]][weapon_info[1]].weapon_info.image}></img>
              </td>
            </OverlayTrigger>

            </ThemeProvider>
          )
      }
      else{
        return(<td></td>)
      }
    }
    else{
      return(<td></td>)
    }

    return(<></>)
  }
  return (
    <tbody>
      {leaderboardInfo.players.map(([user_hash, user]) => {
        return(
          renderElement(user.roll_scores, user.user_info, user_hash, leaderboardInfo.weapon_hashes, colourblindMode)
        )
      })}
    </tbody>
  )
}

export default ColumnBody
