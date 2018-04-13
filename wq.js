const express = require('express')
var bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// if a message hasn't been completed after this interval
// it will be sent to a new consumer
const RETRY_INTERVAL = 2 * 1000 // 2 secs

var messages = {}
var nextID = 0

getNextID = () => {
  current = nextID;
  nextID = nextID + 1;
  return current;
}

submit = (req, res) => {
  msg = req.body.msg;
  id = getNextID();
  messages[id] = {msg:msg};
  res.send({id:id});
} 

pull = (req, res) => {
  now = Date.now();
  toSend = []
  for (id in messages) {
    console.log(id);
    entry = messages[id];
    if (entry === undefined) { //figure out why i need this
      console.log("UNDEFINED");

      continue;
    }

    if ("sent" in entry && entry.sent + RETRY_INTERVAL > now) {
            console.log("OUT FOR JOB");

      // if an entry has never been consumed or if not enough time has passed
      // since it was last sent for consumption, we can skip it
      continue;
    }

    console.log("SENDING");
    // otherwise, send it for consumption
    entry.sent = now;
    toSend.push({id:id, msg:entry.msg})
  }
  res.send(toSend);
}

complete = (req, res) => {
  id = req.body.id;
  if (id in messages) {
    delete messages[id];
    res.send("completed " + id);
  } else {
    res.error(id + " already completed");
  }
}

inspect = (req, res) => {
  res.send(messages);
}


app.get('/inspect', inspect)

app.post('/pull', pull) // takes no parameters
app.post('/submit', submit) // expects 'msg' in body
app.post('/complete', complete) // expects 'id' in body

app.listen(3000, () => console.log('Example app listening on port 3000!'))
