import React, { Component } from 'react';
import './TestApp.css'

const HOST_URL = 'http://localhost:3000'

class TestApp extends Component {
 
  constructor(props) {
    super(props);
    this.state = {q:[], 
                  consumers:[], 
                  lastSubmitId:null, 
                  checkResult:null};
  }

  componentDidMount() {
    this.newConsumer();
  }

  makePost(url, data={}) {
    return fetch(HOST_URL + url, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(response => response.json()) // parses response to JSON
  }

  submitMessage() {
    var msg = this.refs.messageInput.value;
    this.refs.messageInput.value = "";
    this.makePost("/submit", {msg:msg})
      .then(data => {
        this.refs.checkInput.value = data.id;
        this.setState({lastSubmitId:data.id});
      });
  }

  checkID() {
    var id = this.refs.checkInput.value;
    fetch(HOST_URL + '/check/' + id)
      .then(response => response.json())
      .then(data => this.setState({checkResult:data.status}))
  }

  newConsumer() {
    var newConsumers = this.state.consumers;
    newConsumers.push({jobs: []});
    this.setState({consumers:newConsumers})
  }

  consumerPull(index) {
    var newConsumers = this.state.consumers;
    this.makePost("/pull")
      .then(data => {
        for (var job in data) {
          newConsumers[index].jobs.push(data[job]);
        }
        this.setState({consumers:newConsumers});
      });
  }

  consumerDelete(index) {
    var newConsumers = this.state.consumers;
    newConsumers.splice(index, 1);
    this.setState({consumers:newConsumers});
  }

  consumerForgetJob(index, jobIndex) {
    var newJobs = this.state.consumers[index].jobs;
    newJobs.splice(jobIndex, 1);

    var newConsumers = this.state.consumers;
    newConsumers[index].jobs = newJobs;
    this.setState({consumers:newConsumers});
  }

  consumerCompleteJob(index, jobIndex) {
    var jobID = this.state.consumers[index].jobs[jobIndex].id;
    this.makePost("/complete", {id:jobID})
      .then(data => {
        this.setState({lastConsumerResponse:data.status});
        if (data.status === 'completed') {
          this.consumerForgetJob(index, jobIndex);
        }
      });
  }

  render() {
    return (
      <div className="TestApp">
        <div className="Producer">
          <h1>Producer:</h1>
          <table>
            <tbody>
              <tr>
                <td>
                  Message:
                  <input type="text" ref="messageInput" />
                  <button className="SubmitButton" onClick={() => this.submitMessage()} >Submit Message</button>
                  <br />
                  Last Created Message ID: {this.state.lastSubmitId}
                </td>
                <td>
                  ID to check:
                  <input type="text" ref="checkInput" />
                  <button className="CheckButton" onClick={() => this.checkID()} >Check</button>
                  <br />
                  Check Result: {this.state.checkResult}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="Consumers">
          <h1>Consumers:</h1>
          <button className="NewConsumerButton" onClick={() => this.newConsumer()} >New Consumer</button>
          {
            this.state.consumers.map(function(item, i){
              return (
                <div className="Consumer" key={i}>
                  <div className="ConsumerHeader">
                    Current jobs:
                    <br/>
                    <button className="PullButton" onClick={() => this.consumerPull(i)} >Pull for jobs</button>
                    <br/>
                    <button className="DeleteButton" onClick={() => this.consumerDelete(i)} >Delete</button>
                  </div>
                  {
                    this.state.consumers[i].jobs.map(function(job, j){
                      return (
                        <div key={j} className="Job">
                          Job ID: {job.id}
                          <br/>
                          Msg: {job.msg}
                          <br/>
                          <button className="CompleteButton" onClick={() => this.consumerCompleteJob(i, j)} >Complete Job</button>
                          <br/>
                          <button className="ForgetButton" onClick={() => this.consumerForgetJob(i, j)} >Forget Job</button>
                        </div>
                      )
                    }.bind(this))
                  }
                  <br />
                </div>
              )
            }.bind(this))
          }
          <br />
          Last Consumer Complete Response: {this.state.lastConsumerResponse}
        </div>
      </div>
    );
  }

}

export default TestApp;