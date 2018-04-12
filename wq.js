const express = require('express')
const app = express()

var messages = {}
var nextID = 0

getNextID = () => {
  current = nextID;
  nextID = nextID + 1;
  return current;
}

submit = (req, res) => {
  var msg = req.params.msg;
  res.send('Hello World! submit' + getNextID());
} 

pull = (req, res) => {
  res.send('Hello World! pull');
}

app.get('/submit/:msg', submit)
app.get('/pull', pull)


app.listen(3000, () => console.log('Example app listening on port 3000!'))
