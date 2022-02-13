import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchBar from './SearchBar'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import Check from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';

import './style.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Header = ({colourblindMode, setColourblindMode, debugMode, setDebugMode, newOnlyMode, setNewOnlyMode, searchQueries, loadingComplete, setCurrentQuery, setDisplayLimit, setShowDisplayInfo, currentSeasonOnlyMode, setCurrentSeasonOnlyMode}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return(

    <Navbar fill="true" bg="dark" variant="dark" fixed="top">
      <div className="container-fluid">
        <Navbar.Brand href="/">Godroll Rater</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link onClick={setShowDisplayInfo}>Info</Nav.Link>
        </Nav>

        <ThemeProvider theme={darkTheme}>
          <SearchBar
            searchQueries={searchQueries}
            loadingComplete={loadingComplete}
            setCurrentQuery={setCurrentQuery}
          />

          <TextField
            style={{ width: 190, paddingRight: 20 }}
            id="limit rolls"
            variant="standard"
            label="Limit rolls displayed"
            type="number"
            InputProps={{ inputProps: { min: 0 }}}
            onChange={(event) => {
              if (event.target.value <= 0){
                  setDisplayLimit(100)
              }
              else {
                setDisplayLimit(event.target.value)
              }
            }}
          />
          <Button
          id="demo-positioned-button"
          aria-controls="demo-positioned-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          >
            Options
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={setColourblindMode}>
              <ListItemIcon>
              { colourblindMode &&
                <Check />
              }
              </ListItemIcon>
              Colourblind Mode
            </MenuItem>
            <MenuItem onClick={setNewOnlyMode}>
              <ListItemIcon>
                { newOnlyMode &&
                  <Check />
                }
                </ListItemIcon>
              New Items Only
            </MenuItem>
            <MenuItem onClick={setDebugMode}>
              <ListItemIcon>
              { debugMode &&
                <Check />
              }
              </ListItemIcon>
              Debug Mode
            </MenuItem>
            <MenuItem onClick={setCurrentSeasonOnlyMode}>
              <ListItemIcon>
              { currentSeasonOnlyMode &&
                <Check />
              }
              </ListItemIcon>
              Show recently added
            </MenuItem>
          </Menu>
        </ThemeProvider>

        <div className='align-middle'>
        </div>
      </div>
    </Navbar>

  );
}

export default Header;
