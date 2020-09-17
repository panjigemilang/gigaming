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
  socket.on("login", ({ name, isLoggedIn }, callback) => {
    socket.username = data

    if (users.indexOf(socket.username) > -1) {
      callback(false)
    } else {
      callback(true)
      connections.push(name)
      users.push(socket.username)
      updateUsernames()

      console.log("Users connected : ", users)
      if (Object.keys(users).length == 2) {
        io.emit("connected", socket.username)
        io.emit("game-start")
        io.emit("user-connected", { name, users: connections.length })
      }
    }
  })

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id])
    connections.splice(connections.indexOf(users[socket.id], 1))
    console.log("Disconnected user : ", [users[socket.id], connections])

    delete users[socket.id]
  })
})
