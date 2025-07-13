import express from 'express'
const app = express()
import http from 'http'
import { Server } from "socket.io"
import helmet from 'helmet'
import data from './public/data.json' assert { type: "json" }
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http.createServer(app)
const io = new Server(server)
let ip = ''

app.use(helmet({
  contentSecurityPolicy: {
     directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      scriptSrcAttr: ["'none'"], // inline event handler'ları engeller
    }
  }
}))
app.use(express.json())
app.use(express.static("public"))

//check ip
app.get('/check-ip', (req, res) => {
  ip = req.headers["x-forwarded-for"] || req.remoteAddress ||
  req.socket.remoteAddress ||
  (req.socket ? req.socket.remoteAddress : null);
  const stream = fs.createReadStream(path.resolve(__dirname, 'public/ip.txt'));
  let state = false
  stream.on('data',(data) => {
    if(data.toString().includes(ip)){
      state = true
      return false
    }
  })
  stream.on('close',(err) => {
    res.status(200).json({result: state})
  })
})

//save ip
const saveIP = async() => {
  await fs.promises.appendFile(path.resolve(__dirname, 'public/ip.txt', ip+'\n'), (err) => {
    if(!err){
      return false
    }
  })
}

//update vote
const updateVotes = async (index) => {
  const selectedItem = data.filter(item => item.id == index)
  let newVote = selectedItem[0].votes += 1
  //new values of selectedItem in data.json
  data[index] = {
    id: selectedItem[0].id,
    votes: newVote,
    label: selectedItem[0].label,
    color: selectedItem[0].color
  }
  await fs.promises.writeFile(path.resolve(__dirname, 'public/data.json'), JSON.stringify(data), 'utf8', (err => {
    if(!err)return false
  }))
}

//get vote from frontend via socket
io.on("connection", (socket) => {
  io.emit("update", data)
  socket.on("vote", (index) => {
    if (data[index]) {
      updateVotes(index)
      saveIP()
    }
    io.emit("update", data)
  })
})

server.listen(3000, () => {
  console.log('Server is running...')
})