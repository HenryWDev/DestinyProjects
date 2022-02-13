import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';


const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: "white",
  maxHeight: '100%',
  overflow: 'auto'
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Item = styled(Paper)(({ theme }) => ({

  padding: theme.spacing(1),
  textAlign: 'center',
  width: 200,
}));

const SingleWeaponDisplay = ({showSingleWeaponDisplay, setShowSingleWeaponDisplay, weaponRatings, selectedHash, perkInfo}) => {
  const columnNames =  ["perk_1", "perk_2", "perk_3", "perk_4", "masterwork"]
  return (
    <ThemeProvider theme={darkTheme}>
      <Modal
        open={showSingleWeaponDisplay}
        onClose={setShowSingleWeaponDisplay}
        aria-labelledby="modal-modal-title"

      >
        <Box sx={style}>
          <h2>
            {weaponRatings[selectedHash[0]][selectedHash[1]]["info"]["gun name"] + " perks"}
          </h2>

          <Stack spacing={2} direction="row" divider={<Divider flexItem={true} orientation="vertical"  light={true} />}>
          {
            Object.entries(columnNames).map(([, column]) => {
              return(
                <Stack spacing={2}>
                {
                  Object.entries(weaponRatings[selectedHash[0]][selectedHash[1]][column]).map(([, perk_score]) => {
                    return (
                      <Item>

                        <div className="d-inline">
                          <h4 className="d-inline"> {perk_score[1]} </h4>
                          <h5> {perk_score[0]} </h5>
                        </div>
                      </Item>
                    )
                  })
                }
                </Stack>
              )
            })
          }
          </Stack>


        </Box>
      </Modal>
    </ThemeProvider>
  )
}

export default SingleWeaponDisplay
