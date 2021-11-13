const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const InitiateMongoServer = require('./db')
app.use(express.json());    
app.use(express.urlencoded()); 
app.use(cors())
app.use(express.static('public'))

InitiateMongoServer();

const Users = require('./models/Users');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  let return_users = [];
  all_users = await Users.find();
  return_users.push(all_users)
  res.send(all_users);
})

app.post('/api/users', async (req, res) => {
  let { username } = req.body
  try {
    let user = await Users.findOne({'username': username })

    if (user) {
      console.log("found user: ", user)
      res.json(user)
    }
    else {
      user = new Users({
        username
      })
      await user.save()
    }
    res.json(user)
  } catch(error) {
    console.log(error)
  }
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  let { duration, description, date } = req.body;
  
  if (date === "") {     
    date = new Date();
  } else {
    date = Date.parse(date)
    date = new Date(date)
  }
  date = date.toDateString()
  let { _id } = req.params;
  let new_exercise = {
    "description": description,
    "duration": parseInt(duration),
    "date": date
  }
  try {
    let user = await Users.findOne({'_id': _id })
    if (user) {
      let { logs } = user;      
      logs.push(new_exercise);
      await user.save();
      new_exercise['username'] = user.username;
      new_exercise['_id'] = _id;
      res.send(new_exercise)
    } else {
      res.send("Couldn't find user")
    }
  } catch(error) {
    console.log(error);
  }
  
})

app.get('/api/users/:id/logs', async (req, res) => {
  let { id } = req.params;
  let { from, to, limit } = req.query; 

  if (from !== undefined && to !== undefined) {
    console.log("updating dates")
    from = Date.parse(from)
    from = new Date(from)
    to   = Date.parse(to)
    to   = new Date(to)
  }

  try {
    let user = await Users.findOne({ '_id': id });
    console.log('user: ', user)    
    if (from !== undefined && to !== undefined) {
      
      user.logs = user.logs.filter((log) => {
        return (Date.parse(log.date) >= from && Date.parse(log.date) <= to)
      })
    }
    if (limit !== undefined) {      
      limit = parseInt(limit)
      user.logs = user.logs.slice(0,limit);
    }

    user['count'] = user.logs.length;

    if (user) {      
      res.json(user);      
    } else {
      res.send("That user does not exist");
    }
  } catch(error) {
    console.log(error);
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
