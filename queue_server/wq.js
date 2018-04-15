const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// if a message hasn't been completed after this interval
// it will be sent to a new consumer
const RETRY_INTERVAL = 5 * 1000 // 5 secs

/*
 * WonderQ API. See README (in the root directory)
 */

submit = (req, res) => {
  msg = req.body.msg;
  id = saveMessage({msg:msg, submitted:Date.now(), timesSent:0});
  res.send({id:id});
} 

check = (req, res) => {
  id = req.params.id;
  if (messages[id]) {
    if ('sent' in messages[id]) {
      res.send({'status': 'assigned',
                'ts': messages[id].sent});
    } else {
      res.send({'status': 'unassigned'});
    }
  } else {
    res.send({'status': 'completed'});
  }
}

pull = (req, res) => {
  toSend = getFreshMessages();
  res.send(toSend);
}

complete = (req, res) => {
  id = req.body.id;
  if (id in messages) {
    delete messages[id];
    res.send({status:"completed"});
  } else {
    res.send({status:"not_found"});
  }
} 

inspect = (req, res) => {
  res.send(messages);
}

app.post('/submit', submit) // expects 'msg' in body
app.get('/check/:id', check)

app.post('/pull', pull) // takes no parameters
app.post('/complete', complete) // expects 'id' in body

app.get('/inspect', inspect)


/*
 * Application logic, data storage, and retrieval
 * In a real system the methods below would interact with
 * a database
 */

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
  message.id = id;
  messages[id] = message;
  return id;
}

updateMessage = (id, message) => {
  messages[id] = message;
}

// If I were actually using a database to store and persist
// this data, the logic below would be encapsulated in a single
// query rather than an awkward loop ove all messages.
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
    entry.timesSent = entry.timesSent+1;

    // this isn't strictly necessary with this in-memory implementation
    // but this would likely be required depending on the database system
    // we were using.
    updateMessage(id, entry);

    fresh.push({id:id, msg:entry.msg})
  }
  return fresh;
}



app.listen(3000, () => console.log('WonderQ listening on port 3000'))
