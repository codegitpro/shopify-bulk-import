import React from 'react';
import logo from './logo.svg';
import './App.css';

import { ExcelReader } from "./components"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ExcelReader />
      </header>
    </div>
  );
}

export default App;
