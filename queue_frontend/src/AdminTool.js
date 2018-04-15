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
        var msgsList = [];
        for (var item in data) {
          msgsList.push(data[item]);
        }
        this.setState({ q: msgsList});
      });
  }

  render() {
    return (
      <div className="AdminTool">
        <button className="RefreshButton" onClick={() => this.refresh()} >Refresh</button>
        <table>
          <tbody>
            <tr>
              <td>Job ID</td><td>Message</td><td>Enqueued</td><td>Last Sent</td><td>Times Sent</td>
            </tr>
            {
              this.state.q.map(function(item, i){
                // return <div key={item.id}>Hello job {item.id} with message {item.msg} </div>
                return (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.msg}</td>
                    <td>{item.submitted}</td>
                    <td>{item.sent}</td>
                    <td>{item.timesSent}</td>
                  </tr>
                )
              }.bind(this))
            }
          </tbody>
        </table>

      </div>
    );
  }

}

export default AdminTool;