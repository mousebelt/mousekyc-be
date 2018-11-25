const socketServer = function (io) {
  io.on('connection', (socket) => {

    socket.on('disconnect', () => {
      console.log('disconnected'); // eslint-disable-line
    });
  });
};

module.exports = socketServer;
