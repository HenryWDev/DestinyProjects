import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SingleWeaponDisplay from './SingleWeaponDisplay'
import Table from 'react-bootstrap/Table'
import React, { useState } from 'react'

const RollDisplay = ({perkInfo, gunRatings, colourblindMode, debugMode, weaponRatings}) => {
  const [ selectedHash, setSelectedHash ] = useState()
  const [ showSingleWeaponDisplay, setShowSingleWeaponDisplay ] = useState(false)
  const [ firstTimeLoad, setFirstTimeLoad ] = useState(false)
  const column_names = [["perk_1","smallimg"], ["perk_2","smallimg"], ["perk_3","smallimg"], ["perk_4","smallimg"], ["masterwork","largeimg"]]

  return (
    <div>
      {firstTimeLoad && <SingleWeaponDisplay
                        showSingleWeaponDisplay={showSingleWeaponDisplay}
                        setShowSingleWeaponDisplay={() => setShowSingleWeaponDisplay(!showSingleWeaponDisplay)}
                        weaponRatings={weaponRatings}
                        selectedHash={selectedHash}
                        perkInfo={perkInfo}
      />}

      <Table striped bordered hover  className="bottomPadding">
        <tbody  className="bottomPadding">
          {Object.entries(gunRatings).map(([hash, activity_types]) => {
            return(
              <React.Fragment key={"weapon hash holder " + hash}>
                {
                Object.entries(activity_types).map(([activity_type, rating_array]) => {
                  return(
                    <React.Fragment key={"activity type holder " + hash + " " + activity_type}>
                      {
                      Object.entries(rating_array.weapons).map(([key, rating]) => {
                        return(
                          <tr key={hash + activity_type + rating.weapon_count} className={rating.new ? "newWeapon" : "oldWeapon"}>
                            <td  key="weapon display" style={{position:"relative"}} className={colourblindMode ? (rating.rating + "colourblind") : rating.rating}>
                              <InfoOutlinedIcon
                                className="infoIcon"
                                onClick={() => {setShowSingleWeaponDisplay(true)
                                                setSelectedHash([hash, activity_type])
                                                setFirstTimeLoad(true)
                                              }}
                              />
                              {rating.new &&
                                <h5 className="newText"><b>NEW</b></h5>
                              }
                              {
                                rating.adept &&
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 100, hide: 200 }}
                                  overlay={
                                    <Popover>
                                      <Popover.Header className="tooltipText" as="h3" >Adept variant</Popover.Header>
                                      <Popover.Body >
                                        <div className="tooltipText"> This roll is the <b>Adept/Timelost</b> variant of the normal weapon. </div>
                                      </Popover.Body>
                                    </Popover>
                                  }
                                >
                                  <img src="https://www.bungie.net/common/destiny2_content/icons/d3548d7e67c29eaeb451549f7c7fa30f.png" className="adepticon"/>
                                </OverlayTrigger>
                              }
                              <h4>{rating_array.gun_info.["gun name"]} </h4>
                              <img className="largeimg" src={"https://www.bungie.net"+ rating_array.gun_info.image} alt={rating_array.gun_info.["gun name"] + " image"}/>
                              <h5>{rating.total_score}/{rating_array.gun_info.max_score} - {rating.rating}</h5>
                              {debugMode && <p> {rating.score_percentage+"%"}</p>}
                              {debugMode && <p> {rating.unique_hash}</p>}
                            </td>
                            <td key="activity display">

                            {(() => {
                              switch (activity_type) {
                                case "pve": return (
                                    <OverlayTrigger
                                      placement="bottom"
                                      delay={{ show: 100, hide: 200 }}
                                      overlay={
                                        <Popover>
                                          <Popover.Header className="tooltipText" as="h3" >PvE</Popover.Header>
                                          <Popover.Body >
                                            <div className="tooltipText"> This roll has been rated with the intent to shoot dregs with it </div>
                                          </Popover.Body>
                                        </Popover>
                                      }
                                    >
                                      <img className="smallimg" src="https://www.bungie.net/common/destiny2_content/icons/f2154b781b36b19760efcb23695c66fe.png" alt="pve roll"/>
                                    </OverlayTrigger>
                                )
                                case "pvp": return (
                                    <OverlayTrigger
                                      placement="bottom"
                                      delay={{ show: 100, hide: 200 }}
                                      overlay={
                                        <Popover>
                                          <Popover.Header className="tooltipText" as="h3">PvP</Popover.Header>
                                          <Popover.Body>
                                            <div className="tooltipText"> This roll has been rated with the intent to shoot guardians with it </div>
                                          </Popover.Body>
                                        </Popover>
                                      }
                                    >
                                      <img className="smallimg" src="https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fb3e9149c43f7a2e8f8b66cbea7845fe.png" alt="pvp roll"/>
                                    </OverlayTrigger>
                                )
                                default:      return <p>undefined</p>;
                              }
                            })()}
                            </td>
                            {
                              Object.entries(column_names).map(([, column]) => {
                                return(
                                  <td key={column}>
                                  {
                                    Object.entries(rating[column[0]]).map(([perk, score]) => {
                                      return(
                                        <React.Fragment key={"perk holder " + hash + " " + activity_type + " " + rating.weapon_count + " " + perk}>
                                          <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 100, hide: 200 }}
                                            overlay={
                                              <Popover>
                                                <Popover.Header className="tooltipText" as="h3">{perk}</Popover.Header>
                                                <Popover.Body>
                                                  <div className="tooltipText"> {perkInfo[perk].description} </div>
                                                </Popover.Body>
                                              </Popover>
                                            }
                                          >
                                            <img className={column[1]} src={"https://www.bungie.net" + perkInfo[perk].icon} alt={perkInfo[perk].icon} />
                                          </OverlayTrigger>
                                          <p>{perk} {score}/{rating.max_column_scores.[column[0]]}</p>

                                        </React.Fragment>
                                      )
                                    })
                                  }
                                  </td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default RollDisplay
