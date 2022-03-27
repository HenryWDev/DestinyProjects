import './App.css';
import Header from './components/Header'
import SliderController from './components/SliderController'
import * as React from 'react';


function App() {

  const [showSymbols, setShowSymbols] = React.useState(false);
  const [aussieCallouts, setAussieCallouts] = React.useState(true);

  return (
    <div className="App">
      <Header toggleSymbols={() => setShowSymbols(!showSymbols)} toggleAussie={() => setAussieCallouts(!aussieCallouts)} />
      <SliderController showSymbols={showSymbols} aussieCallouts={aussieCallouts} />
    </div>
  );
}

export default App;
