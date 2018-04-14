const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// if a message hasn't been completed after this interval
// it will be sent to a new consumer
const RETRY_INTERVAL = 2 * 1000 // 2 secs

/* Application data storage and retrieval */
var messages = {}
var nextID = 0

getNextID = () => {
  current = nextID;
  nextID = nextID + 1;
  return current;
}

loadMessage = (id) => {
  return messages[id];
}

saveMessage = (message) => {
  id = getNextID();
  messages[id] = message;
  return id;
}

getFreshMessages = () => {
  now = Date.now();
  fresh = []
  for (id in messages) {
    entry = messages[id];

    if ("sent" in entry && entry.sent + RETRY_INTERVAL > now) {
      // if an entry has never been consumed or if not enough time has passed
      // since it was last sent for consumption, we can skip it
      continue;
    }

    // otherwise, send it for consumption
    entry.sent = now;
    fresh.push({id:id, msg:entry.msg})
  }
  return fresh;
}

/* Queue API */
submit = (req, res) => {
  msg = req.body.msg;
  console.log("on server msg is " + msg)
  id = saveMessage({msg:msg});
  res.send({id:id});
} 

pull = (req, res) => {
  toSend = getFreshMessages();
  res.send(toSend);
}

complete = (req, res) => {
  id = req.body.id;
  if (id in messages) {
    delete messages[id];
    res.send({status:"ok"});
  } else {
    res.send({status:"already completed this job"});
  }
} 

inspect = (req, res) => {
  res.send(messages);
}

app.get('/inspect', inspect)
app.post('/pull', pull) // takes no parameters
app.post('/submit', submit) // expects 'msg' in body
app.post('/complete', complete) // expects 'id' in body

app.listen(3000, () => console.log('WonderQ listening on port 3000'))
