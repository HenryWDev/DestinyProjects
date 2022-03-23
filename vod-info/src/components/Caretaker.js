import React from 'react'
import PropTypes from 'prop-types'
import LootDrawer from './LootDrawer'
import Main_Infographic from './CaretakerResources/main_infographic.png'
import Typography from '@mui/material/Typography';
import Symbols from './GeneralResources/symbols.jpg'


const Caretaker = ({showSymbols}) => {
  return (
    <div>
      <LootDrawer image_number={1}/>
      <Typography style={{textAlign:"center"}}> Couldn't find an infographic for this encounter, so i made one :)</Typography>
      <div class="imagecontainer">
        <img class="mainImage" src={Main_Infographic}/>
        {showSymbols ? <img class="mainImage" src={Symbols}/> : ''}
      </div>
    </div>
  )
}

export default Caretaker
