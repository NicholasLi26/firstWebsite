import './css/App.css';
import React, { useEffect, useState } from 'react';
import Background from './components/Background.js';
import Foreground from './components/Foreground.js'; // Import the Foreground component
import Home from './pages/Home.js';

function App() {
  const parentRef = React.useRef(null);

  const [page, setPage] = useState("main");

  return (
    
    <div className="App" ref = {parentRef} style={{  overflowY: 'scroll' }}>
      
      <Background parentRef = {parentRef} />
      <Foreground parentRef = {parentRef} setPage = {setPage} /> 
      <Home  parentRef = {parentRef} page = {page}/>

    </div>
  );
}

export default App;
