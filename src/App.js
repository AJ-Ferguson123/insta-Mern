const express = require('express')
const app = express()
const mongose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')
//import './App.css';


mongose.connect(MONGOURI, {
  useNewUrlParser:true,
  useUnifiedTopology:true
})
mongose.connection.on('connected', ()=> {
  console.log("connected to mongo")
})
mongose.connection.on('error', (err) => {
  console.log("error connecting")
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="PRODUCTION") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT,() => {
  console.log("server is running on port", PORT)
})

