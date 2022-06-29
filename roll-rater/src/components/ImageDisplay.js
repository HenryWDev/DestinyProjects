import { useState, useEffect } from 'react'
import { Image } from '@mantine/core';
import { Container } from '@mantine/core';
import { Center } from '@mantine/core';
import React from 'react'
import PropTypes from 'prop-types'


const ImageDisplay = ({size, link, alt, text, text_style, states, weapon_dict, index, path, base_path}) => {
  const [opened, setOpen] = useState(false);
  const [state, setState] = useState(0)


  useEffect(() => {
    if (base_path.length !== 0){
      setState(weapon_dict[index][base_path[0]][base_path[1]][path])
    }
    else{
      setState(weapon_dict[index][path])
    }
  }, []);



  function changeState(){
    if (state == states.length - 1){
      setState(0)

      if (base_path.length !== 0){
        weapon_dict[index][base_path[0]][base_path[1]][path] = 0

      }
      else{
        weapon_dict[index][path] = 0
      }
    }
    else{
      setState(state + 1);

      if (base_path.length !== 0){
        weapon_dict[index][base_path[0]][base_path[1]][path] = state + 1

      }
      else{
        weapon_dict[index][path] = state + 1
      }
    }
  }

  return (

      <Container
        className={"object-center pt-1 pb-1 w-fit hover:bg-sky-700 " + states[state]}
        style={{width: "90px"}}
        onClick={changeState}
      >
      <Center>
        <Image
          className="object-center "
          width={size}
          height={size}
          radius="sm"
          src={link}
          alt={alt}>
        </Image>
        </Center>
          <p style={{"overflowwrap": "break-word"}} className={text_style + " text-xs"}  >{text}</p>
      </Container>

  )
}

export default ImageDisplay
