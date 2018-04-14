import React, { Component } from 'react';


class AdminTool extends Component {
 
  constructor(props) {
    super(props);
    this.state = {q:[]};
  } 

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    fetch('http://localhost:3000/inspect')
      .then(response => response.json())
      .then(data => {
        console.log("hiii");
        var msgsList = [];
        for (var item in data) {
          console.log("here");
          msgsList.push({id: item, msg: data[item].msg});
        }
        this.setState({ q: msgsList});
      })
  }

  render() {
    return (
      <div className="AdminTool">
        {
          this.state.q.map(function(item, i){
            return <div key={item.id}>Hello job {item.id} with message {item.msg} </div>
          }.bind(this))
        }
        <button className="RefreshButton" onClick={() => this.refresh()} >Refresh</button>
      </div>
    );
  }

}

export default AdminTool;