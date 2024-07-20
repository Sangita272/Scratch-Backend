const socketIo = require('socket.io');
const _ = require('lodash');
let io;

function initialize(server) {
  io = socketIo(
    server
    , {
      cors: {
        origin: '*', // Replace with the correct port
        methods: ['GET', 'POST'],
        credentials: true,
      },
    }
  );

  io.sockets.on("connection", async function (client) {

    client.on("sentFriendRequest", async function (data) {
      const res = await sentFriendRequest(data);
      io.sockets.emit("sentFriendRequestResponse", {...res, ...data});
    });

    client.on("rejectFriendRequest", async function (data) {
      const res = await rejectFriendRequest(data);
      io.sockets.emit("rejectFriendRequestResponse", {...res, ...data});
    });

  });
}

function getIo() {
  return io;
}

module.exports = { initialize, getIo };
