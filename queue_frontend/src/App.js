import React, { Component } from 'react';
import logo from './logo.svg';
import AdminTool from './AdminTool.js';
import TestApp from './TestApp.js'
import './App.css';

import { BrowserRouter, Route, Link } from 'react-router-dom'

class App extends Component {

  constructor() {
    super()
    this.state = {q:[]};
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={AdminTool} />
          <Route path="/admin" component={AdminTool} />
          <Route path="/app" component={TestApp} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
