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





  return (

      <Container
        className={"object-center pt-1 pb-1 w-fit " + states[state]}
        style={{width: "90px"}}
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
