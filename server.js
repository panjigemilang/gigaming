const app = require("express")()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const connections = []
const users = []
const choices = []

const port = process.env.PORT || 5000

http.listen(port, () => console.log(`Server running on port ${port}`))

// functions
const updateUsernames = () => {
  io.sockets.emit("get-users", users)
}

// User events
io.on("connection", (socket) => {
  connections.push(socket)
  console.log("User connected : ", connections.length)

  // Events
  socket.on("login", ({ name }, callback) => {
    socket.username = name

    if (users.indexOf(socket.username) > -1) {
      callback(false)
    } else {
      callback(true)
      users.push(socket.username)
      updateUsernames()

      console.log("Users connected : ", users)
      if (Object.keys(users).length == 2) {
        io.emit("game-start")
        io.emit("user-connected", { name, users: connections.length })
      }
    }
  })

  socket.on("get-user-connected", ({ name }) => {
    // const index = users.indexOf(socket.username, 1)
    io.emit("get-user-connect", { name: socket.username })
  })

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket, 1))
    users.splice(users.indexOf(socket.username), 1)
    updateUsernames()
    socket.broadcast.emit("user-disconnected", socket.username)
    console.log("Disconnected user : ", [socket.username, connections])
  })
})
