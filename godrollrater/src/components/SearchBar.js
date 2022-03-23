import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react'



import './style.css'




const SearchBar = ({searchQueries, loadingComplete, setCurrentQuery}) => {
  const [open, setOpen] = useState(false);

  return(

    <Autocomplete
      multiple
      id="search bar"
      options={loadingComplete ? searchQueries : []}
      getOptionLabel={(option) => option["gun name"]}
      size="small"
      className='palette.primary'
      limitTags={2}
      style={{ width: 500, paddingRight: 10 }}
      onChange={(event, newValue) => {
        setCurrentQuery(newValue)
      }}
      loading={!loadingComplete}
      open = {open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}

      renderInput={(params) => <TextField
                                  {...params}
                                  label="Filter Weapons"
                                  variant="standard"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {open
                                          ? [(loadingComplete
                                            ? null
                                            : <CircularProgress color="inherit" size={20} />)]
                                          : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />}
      />
  );
}

export default SearchBar;
