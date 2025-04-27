import './css/App.css';
import image1 from './images/random/Forest2.png';
import React, { useEffect } from 'react';
import Background from './components/Background.js';

function App() {
  return (
    <div className="App">
      <Background />
      <div className="content">
        <h1>Welcome to the App</h1>
        <p>This is a simple React app with a background image.</p>
        <br style={{ lineHeight: '10000px' }} />
        <p>Scroll down to see the background effect.</p>
      </div>



    </div>
  );
}

export default App;
