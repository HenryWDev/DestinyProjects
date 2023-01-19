import React, { useState, useEffect } from 'react'
import { Divider } from '@mantine/core';
import { Container } from '@mantine/core';
import { Grid } from '@mantine/core';
import { Image } from '@mantine/core';
import { Center } from '@mantine/core';
import { Button, Collapse } from '@mantine/core';
import { Table } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import { IconTrash } from '@tabler/icons';
import ImageDisplay from './ImageDisplay.js'
import { Textarea } from '@mantine/core';

const WeaponDisplay = ({weapon_dict, index, deleteWeapon}) => {
  const card_bg = "bg-stone-800"
  const text_style = "text-white font-sans flex-wrap text-center"
  const [opened, setOpen] = useState(false);
  const [notes, setNotes] = useState('');

  
  useEffect(() => {
    weapon_dict[index]["description"] = notes
  }, [notes]);

  let activity_states = ['', 'bg-gradient-to-r from-cyan-500 to-blue-500']
  let perk_states = ['', 'bg-gradient-to-r from-amber-700 to-amber-900', 'bg-gradient-to-r from-gray-700 to-gray-800', 'bg-gradient-to-r from-yellow-600 to-amber-400']
  return (
    <div key="maindiv">
    <Grid gutter="md" className="p-3" >
      <Grid.Col span={1} key="colmain1">
        <Container className="bg-stone-800 mt-0 py-2">
          <Image
            width={100}
            height={100}
            radius="sm"
            src={"https://www.bungie.net" + weapon_dict[index]["displayProperties"]["icon"]}
            alt="Weapon Image">
          </Image>
          <p className={text_style}> {weapon_dict[index]["displayProperties"]["name"]} </p>
        </Container>
      </Grid.Col>
      <Grid.Col span={10} key="buttondropdown">
      <Button onClick={() => setOpen((o) => !o)} color="gray" variant="outline" style={{width: "100%"}} className="ml-3">
        <IconChevronDown className={opened ? 'rotate-180' : 'rotate-0' + " duration-200 ease-linear"}/>
      </Button>
        <Collapse in={opened}>
          <Grid gutter="md" className="p-3"  >
            <Grid.Col span={1} key="col1">
              <Container className={card_bg + " p-2"}>
                {Object.keys(weapon_dict[index]["perks 0"]).map((key,i) => (
                  <ImageDisplay size={50}
                                link={"https://www.bungie.net" + weapon_dict[index]["perks 0"][key]["displayProperties"]["icon"]}
                                alt={key}
                                key={key}
                                text={weapon_dict[index]["perks 0"][key]["displayProperties"]["name"]}
                                states={perk_states}
                                path={"rating"}
                                base_path={["perks 0", key]}
                                weapon_dict={weapon_dict}
                                index={index}
                                text_style={text_style}/>
                ))}
              </Container>
            </Grid.Col>
            <Grid.Col span={1} key="col2">
              <Container className={card_bg + " p-2"}>
                {Object.keys(weapon_dict[index]["perks 1"]).map((key,i) => (
                  <ImageDisplay size={50}
                                link={"https://www.bungie.net" + weapon_dict[index]["perks 1"][key]["displayProperties"]["icon"]}
                                alt={key}
                                key={key}
                                text={weapon_dict[index]["perks 1"][key]["displayProperties"]["name"]}
                                states={perk_states}
                                path={"rating"}
                                base_path={["perks 1", key]}
                                weapon_dict={weapon_dict}
                                index={index}
                                text_style={text_style}/>
                ))}
              </Container>
            </Grid.Col>
            <Grid.Col span={1} key="col3">
              <Container className={card_bg + " p-2"}>
                {Object.keys(weapon_dict[index]["perks 2"]).map((key,i) => (
                  <ImageDisplay size={50}
                                link={"https://www.bungie.net" + weapon_dict[index]["perks 2"][key]["displayProperties"]["icon"]}
                                alt={key}
                                text={weapon_dict[index]["perks 2"][key]["displayProperties"]["name"]}
                                states={perk_states}
                                path={"rating"}
                                base_path={["perks 2", key]}
                                weapon_dict={weapon_dict}
                                index={index}
                                text_style={text_style}/>
                ))}
              </Container>
            </Grid.Col>
            <Grid.Col span={1} key="col4">
              <Container className={card_bg + " p-2"}>
                {Object.keys(weapon_dict[index]["perks 3"]).map((key,i) => (
                  <ImageDisplay size={50}
                                link={"https://www.bungie.net" + weapon_dict[index]["perks 3"][key]["displayProperties"]["icon"]}
                                alt={key}
                                key={key}
                                path={"rating"}
                                base_path={["perks 3", key]}
                                weapon_dict={weapon_dict}
                                index={index}
                                text={weapon_dict[index]["perks 3"][key]["displayProperties"]["name"]}
                                states={perk_states}
                                text_style={text_style}/>
                ))}
              </Container>
            </Grid.Col>
            <Grid.Col span={1} key="col5">
              <Container className={card_bg + " p-2"}>
                {Object.keys(weapon_dict[index]["masterworks"]).map((key,i) => (
                  <ImageDisplay size={60}
                                link={"https://www.bungie.net" + weapon_dict[index]["masterworks"][key]["displayProperties"]["icon"]}
                                alt={key}
                                key={key}
                                weapon_dict={weapon_dict}
                                index={index}
                                path={"rating"}
                                base_path={["masterworks", key]}
                                text={weapon_dict[index]["masterworks"][key]["name"]}
                                states={perk_states}
                                text_style={text_style}/>
                ))}
                </Container>
              </Grid.Col>
              <Grid.Col span={1} key="col6">
                <Container className={card_bg + " p-2 "}>
                  <ImageDisplay size={50}
                                link={"https://www.bungie.net/common/destiny2_content/icons/f2154b781b36b19760efcb23695c66fe.png"}
                                alt={"PvE icon"}
                                text={"PvE"}
                                key={"pve"}
                                weapon_dict={weapon_dict}
                                index={index}
                                states={activity_states}
                                base_path={[]}
                                path={["is_pve_roll"]}
                                text_style={text_style}/>
                  <ImageDisplay size={50}
                                link={"https://bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fb3e9149c43f7a2e8f8b66cbea7845fe.png"}
                                alt={"PvP icon"}
                                text={"PvP"}
                                key={"pvp"}
                                weapon_dict={weapon_dict}
                                index={index}
                                base_path={[]}
                                path={["is_pvp_roll"]}
                                states={activity_states}
                                text_style={text_style}/>
                  </Container>
                </Grid.Col>
                <Grid.Col span={3} key="col7">
                  <Textarea
                    value={notes} onChange={(event) => setNotes(event.currentTarget.value)}
                    placeholder=""
                    label="Notes"
                  />
                </Grid.Col>
            </Grid>
          </Collapse>
        </Grid.Col>
        <Grid.Col span={1} key="colmain2">
          <Button onClick={() => deleteWeapon(index)} color="red" variant="outline" key="buttonbin">
            <IconTrash />
          </Button>
        </Grid.Col>
      </Grid>
      <Divider variant="dotted" />
    </div>
  );
}

export default WeaponDisplay;
