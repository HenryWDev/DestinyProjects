
import React from 'react'
import PropTypes from 'prop-types'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Box from '@mui/material/Box';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Acquisition from './Acquisition'
import Caretaker from './Caretaker'
import Exhibition from './Exhibition'
import Rhulk from './Rhulk'
import './style.css'


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const steps = ['Acquisition', 'Caretaker', 'Exhibition', 'Rhulk'];

const SliderController = ({showSymbols, aussieCallouts}) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: '100%' }}>
       <Stepper nonLinear activeStep={activeStep}>
         {steps.map((label, index) => (
           <Step key={label} >
             <StepButton color="inherit" onClick={handleStep(index)}>
               {label}
             </StepButton>
           </Step>
         ))}
       </Stepper>
         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
           <Button
             disabled={activeStep === 0}
             onClick={handleBack}
             sx={{ mr: 1 }}
           >
             Back
           </Button>
           <Box sx={{ flex: '1 1 auto' }} />
           <Button onClick={handleNext}
                   sx={{ mr: 1 }}
                   disabled={activeStep === steps.length - 1}>
             Next
           </Button>
        </Box>
      </Box>
      <Box sx={{ width: '100%'}}>
        {
          {
            '0': <Acquisition showSymbols={showSymbols} aussieCallouts={aussieCallouts}/>,
            '1': <Caretaker showSymbols={showSymbols} aussieCallouts={aussieCallouts}/>,
            '2': <Exhibition showSymbols={showSymbols} aussieCallouts={aussieCallouts}/>,
            '3': <Rhulk showSymbols={showSymbols} aussieCallouts={aussieCallouts}/>
          }[activeStep]
        }
      </Box>
    </ThemeProvider>
  )
}

export default SliderController
