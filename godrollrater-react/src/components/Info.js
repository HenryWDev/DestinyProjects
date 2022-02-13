import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import React from 'react';

import rated_weapons from './ratings.json';

const Info = ({searchQueries, showDisplayInfo, setShowDisplayInfo}) => {
  return (
    <Modal show={showDisplayInfo} onHide={setShowDisplayInfo} size="lg" >
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Info</Accordion.Header>
          <Accordion.Body >
            <p className="infopage">
              Godroll rater is an idea by FtpApoc, where rolls are given scores based on their perks and masterworks, and are given a god/great/good/bad status based on these scores.
              <br/><br/>
              If you see anything weird about the rolls displayed, or you get an error while trying to rate your weapons, Message me on discord at DaPoliceman#7777 and ill get it fixed!
              <br/><br/>
              You can check out the code for this page, and the whole website, on my <a href="https://github.com/DaPoliceman/DestinyProjects/tree/main/godrollRater">Github</a>.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Supported Weapons</Accordion.Header>
          <Accordion.Body>
            <ul>
              {
                Object.entries(rated_weapons).map(([hash, rating]) => {
                  return(
                    <React.Fragment key={hash}>
                      {
                        Object.entries(rating).map(([, weapon_info]) => {
                          return(
                            <li className="infopage" key={weapon_info["info"]["gun name"] + " " + weapon_info["info"]["activity type"]}>
                              {weapon_info["info"]["gun name"]} - ({weapon_info["info"]["activity type"]})
                            </li>
                          )
                        })
                      }
                    </React.Fragment>
                  )
                })
              }
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Contributors</Accordion.Header>
          <Accordion.Body className="infopage">
            Each of these amazing people worked on this project in some way, if they have socials listed i'd appreciate if you checked them out!
            <br/><br/>
            <dl>
                <dt>FtpApoc</dt>
                <dd>
                - roll rater
                </dd>
                <dd>
                - backend work
                </dd>
                <dt>Mono Antumbra</dt>
                <dd>
                - roll rater
                </dd>
                <dd>
                - <a href="https://twitter.com/monoantumbra">Twitter</a> <a href="https://www.youtube.com/channel/UCbG4QVwcsIxsBRpsbtaXDeA">Youtube</a>
                </dd>
                <dt>Doozer</dt>
                <dd>
                - roll rater
                </dd>
                <dd>
                - backend work
                </dd>
            </dl>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Data use</Accordion.Header>
          <Accordion.Body className="infopage">
            Before authenticating with this website, please note that I store information linking your user details to your highest roll scores.
            <br />
            This is because im working on a leaderboard to show the top users scores.

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )
}

export default Info
