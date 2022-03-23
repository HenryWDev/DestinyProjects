import React from 'react'
import PropTypes from 'prop-types'
import Main_Infographic from './RhulkResources/main_infographic.png'
import LootDrawer from './LootDrawer'
import Symbols from './GeneralResources/symbols.jpg'



const Rhulk = ({showSymbols}) => {
  return (
    <div>
      <LootDrawer image_number={3}/>
      <div class="imagecontainer">
        <img class="mainImage" src={Main_Infographic}/>
        {showSymbols ? <img class="mainImage" src={Symbols}/> : ''}
      </div>
    </div>
  )
}

export default Rhulk
