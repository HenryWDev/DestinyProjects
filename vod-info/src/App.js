import './App.css';
import Header from './components/Header'
import SliderController from './components/SliderController'
import * as React from 'react';


function App() {

  const [showSymbols, setShowSymbols] = React.useState(false);

  return (
    <div className="App">
      <Header toggleSymbols={() => setShowSymbols(!showSymbols)} />
      <SliderController showSymbols={showSymbols} />
    </div>
  );
}

export default App;
