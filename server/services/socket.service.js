const socketServer = function (io) {
	io.on('connection', function (socket) {

		socket.on('disconnect', function () {
			console.log("disconnected");
		});
	});
};

module.exports = socketServer;