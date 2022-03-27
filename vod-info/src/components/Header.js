import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import * as React from 'react';
import Check from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import BonusChest from './GeneralResources/bonus_chest.png'

import './style.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Header = ({toggleSymbols, toggleAussie}) => {
  const [open, setOpen] = React.useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return(
  <ThemeProvider theme={darkTheme}
                 sx={{ flexGrow: 1 }}
                 component="div"
  >
    <Box sx={{ flexGrow: 1 }}>
      <AppBar fill="true" bg="dark"  variant="dark" fixed="top">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Vow of the Disciple Info
          </Typography>
          <Button onClick={toggleAussie}>Toggle Aussie Callouts</Button>
          <Button onClick={toggleSymbols}>Toggle Permenant Symbols</Button>
          <Button onClick={handleToggle}>Bonus Chest Symbols</Button>

        </Toolbar>
      </AppBar>
    </Box>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
      <img class="BonusChest" src={BonusChest}/>
    </Backdrop>
  </ThemeProvider>
  );
}

export default Header;
