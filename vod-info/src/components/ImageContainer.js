import React from 'react'
import Box from '@mui/material/Box';


const ImageContainer = ({image, aussieCallouts}) => {

  return (

    <Box className="imagecontainer"
      sx={{
        display: 'inline-flex',
        padding: '5px',

      }}
    >
      <Box
        sx={{
          display: 'flex',
          border: '2px solid black',
        }}
      >
        <img alt="infographic" className={aussieCallouts? "mainImage":"aussieImage"} src={image}/>
      </Box>
    </Box>
  )
}

export default ImageContainer
