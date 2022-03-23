import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect } from 'react'


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function insertValue(table, value){
  console.log(table, value)
  if (table != undefined && value && value != 0){
    const requestOptions2 = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'table': table,
          'time': (+ new Date()),
          'value': value
         })
    };
    fetch('http://localhost:3001/add_values', requestOptions2)
        .then(response => response.json())
        .then(output => console.log(output))
  }
}

function createTable(table){
  if (table != undefined){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'table': table,
         })
    };
    fetch('http://localhost:3001/create_table', requestOptions)
        .then(response => response.json())
        .then(output => console.log(output))
  }
}


function APIOverlay({showApiOverlay, setShowApiOverlay, currentTables}) {
  const [price, setPrice] = useState(0)
  const [tableName, setTableName] = useState("")
  const [newTable, setNewTable] = useState("")
  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog open={showApiOverlay} onClose={() => {setShowApiOverlay();}} >
        <DialogTitle>Record prices/Add a new table</DialogTitle>
        <DialogContent sx={{ height: 500}}>
          <DialogContentText>
            Record prices
          </DialogContentText>

          <div style={{ display: 'inline-flex' }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={currentTables}
            onChange={(e) => {setTableName(e.target.innerText)}}
            sx={{ width: 300, paddingRight: 2}}
            renderInput={(params) => <TextField {...params} label="Resource" />}
          />

          <TextField
          id="price-input"
          label="Price"
          maxRows={4}
          value={price}
          InputProps={{ disableUnderline: true }}
          variant="standard"
          onChange={(e) => {setPrice(e.target.value)}}
        />

        </div>
        <DialogActions>
          <Button onClick={() => {insertValue(tableName, price);setPrice(0)}}>Send</Button>
        </DialogActions>

        <DialogContentText>
          Create a new table
        </DialogContentText>
        <TextField
          id="price-input"
          label="Resource"
          maxRows={4}
          value={newTable}
          variant="standard"
          sx={{ width: 490}}
          onChange={(e) => {setNewTable(e.target.value)}}
        />
        <DialogActions>
          <Button onClick={() => {createTable(newTable);setNewTable("")}}>Send</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default APIOverlay
