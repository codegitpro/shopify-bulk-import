import React from 'react';
import logo from './logo.svg';
import './App.css';

import { CsvReaderInput } from "./components"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CsvReaderInput />
      </header>
    </div>
  );
}

export default App;
