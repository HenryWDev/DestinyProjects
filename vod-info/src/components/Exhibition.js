import React from 'react'
import Main_Infographic from './ExhibitionResources/main_infographic.png'
import LootDrawer from './LootDrawer'
import Symbols from './GeneralResources/symbols.jpg'
import ImageContainer from './ImageContainer.js'
import AussieSymbols from './GeneralResources/bona_callouts.png'


const Exhibition = ({showSymbols, aussieCallouts}) => {
  return (
    <div >
      <LootDrawer image_number={0} aussieCallouts={aussieCallouts}/>
      <div className="imagediv">
          {
            aussieCallouts ?
            <ImageContainer image={Main_Infographic} aussieCallouts={aussieCallouts}/>
            :
            <ImageContainer image={Main_Infographic} aussieCallouts={aussieCallouts}/>
          }

          {showSymbols ?
            <>
              {
                aussieCallouts ?
                <ImageContainer image={Symbols} aussieCallouts={aussieCallouts}/>
                :
                <ImageContainer image={AussieSymbols} aussieCallouts={aussieCallouts}/>
              }
            </>
            : ''
          }
      </div>

    </div>
  )
}

export default Exhibition
