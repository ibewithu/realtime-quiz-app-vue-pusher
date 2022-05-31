require('dotenv').config()
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const pusher = new Pusher({
  appId: process.env.VUE_APP_APP_ID,
  key: process.env.VUE_APP_KEY,
  secret: process.env.VUE_APP_SECRET,
  cluster: process.env.VUE_APP_CLUSTER,
  encrypted: true
});


app.set('PORT', process.env.PORT || 5000);


app.post("/pusher/auth//:username", function (req, res) {
  const socketId = req.body.socket_id
  const channel_name = req.body.channel_name
  const authResponse = pusher.authenticate(socketId, channel_name);
  console.log('server auth', authResponse)
  res.send(authResponse);
})



app.listen(app.get('PORT'), () => console.log('Listening at ' + app.get('PORT')))