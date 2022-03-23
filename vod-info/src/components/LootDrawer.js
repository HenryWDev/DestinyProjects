import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import AcquisitionLoot from './AquisitionResources/LootDrops.PNG'
import CaretakerLoot from './CaretakerResources/LootDrops.PNG'
import ExhibitionLoot from './ExhibitionResources/LootDrops.PNG'
import RhulkLoot from './RhulkResources/LootDrops.PNG'
import Symbols from './GeneralResources/symbols.jpg'

const LootDrawer = ({image_number}) => {
  const [lootstate, setLootState] = React.useState(false)
  const loot_images = [AcquisitionLoot, CaretakerLoot, ExhibitionLoot, RhulkLoot]
  const toggleLootDrawer = () => {
    setLootState(!lootstate)
  }

  const [symbolstate, setSymbolState] = React.useState(false)
  const toggleSymbolDrawer = () => {
    setSymbolState(!symbolstate)
  }

  return (
    <div>
      <Button onClick={toggleLootDrawer}>
        Show Loot Table
      </Button>
      <Button style={{float: "right"}} onClick={toggleSymbolDrawer}>
        Show Symbols
      </Button>
      <Drawer
              anchor="left"
              open={lootstate}
              onClose={toggleLootDrawer}

            >
            <img class="" src={loot_images[image_number]}/>
            <Typography> Infographic made by <a href="https://mobile.twitter.com/SquirrelyDan_/status/1501824876608434177"> @SquirrelyDan_</a> </Typography>
      </Drawer>

      <Drawer
              anchor="right"
              open={symbolstate}
              onClose={toggleSymbolDrawer}

            >
            <Box sx={{ width: '60vh' }}>
              <img class="symbolImage" src={Symbols}/>
            </Box>

            <Typography> Infographic made by <a href="https://twitter.com/ascendantraisin/status/1500589310185250821/photo/1"> @ascendantraisin</a> </Typography>
      </Drawer>
    </div>
  )
}

export default LootDrawer
