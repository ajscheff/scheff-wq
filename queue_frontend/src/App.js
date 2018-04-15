import React, { Component } from 'react';
import AdminTool from './AdminTool.js';
import TestApp from './TestApp.js'

import { BrowserRouter, Route } from 'react-router-dom'

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
