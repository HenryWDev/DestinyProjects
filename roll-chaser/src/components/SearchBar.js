import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const SearchBar = ({weapon_list, filter_list}) => {

  return (
    <Container className="pt-3" >
      <ThemeProvider theme={darkTheme}>
        <Autocomplete
          onChange={(event, newValue) => {
            filter_list(newValue);
          }}
          filterSelectedOptions
          multiple
          options={weapon_list}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter Weapons"
              placeholder="Favorites"
            />
          )}
         />
       </ThemeProvider>
    </Container>
  )
}

export default SearchBar
