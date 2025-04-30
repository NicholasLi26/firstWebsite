import './css/App.css';
import React, { useEffect } from 'react';
import Background from './components/Background.js';
import Home from './pages/Home.js';

function App() {
  const parentRef = React.useRef(null);
  return (
    
    <div className="App" ref = {parentRef} style={{  overflowY: 'scroll' }}>
      
      <Background parentRef = {parentRef} />
      <Home  parentRef = {parentRef} />

    </div>
  );
}

export default App;
