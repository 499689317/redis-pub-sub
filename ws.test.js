var http = require("http");
var WebSocket = require("ws");

describe("ws test", function() {

	
	var hostname = "ws://127.0.0.1:8080/";
	var count = 5000, c = 0;// 12000连接数，符合之前压测结果
	var isStop = false;

	it("ws sever test", function (done) {

		return done();

		var server = http.createServer();
		var wss = new WebSocket.Server({noServer: true});

		wss.on('connection', function connection(ws, request, client) {
		  ws.isAlive = true;
		  ws.on('message', function message(msg) {
		    // console.log(`Received message ${msg} from client`);
		  });
		  ws.on("pong", function heartbeat() {
		  	ws.isAlive = true;
		  });
		});
		server.on('upgrade', function upgrade(request, socket, head) {
		 
		    wss.handleUpgrade(request, socket, head, function (ws) {
		      wss.emit('connection', ws, request);
		    });
		});

		server.listen(8080);


		// setInterval(function() {
		// 	wss.clients.forEach(function(c) {
		// 		c.send({msg: "this is call client msg"});
		// 	});
		// });

		setInterval(function() {
			console.info(wss.clients.size);
			if (wss.clients.size > count) {
				isStop = true;
			};
		}, 1000);
		setInterval(function() {
			console.log("heartbeat.........")
			for(var c of wss.clients) {
				if (c.isAlive === false) {
					return c.terminate();
				};
				c.isAlive = false;
				c.ping();
			}
			// --expose-gc
			console.log("before: ", process.memoryUsage());
		    gc();
		    console.log("after: ", process.memoryUsage());

		}, 30000);
		setInterval(function() {

			if (!isStop) {return};

			// 服务器分频道广播数据
			var r = Math.floor(Math.random() * 1000);
			if (r > wss.clients.size) {
				r = wss.clients.size;
			};

			// for of
			var count = 0;
			for(var c of wss.clients) {
				count++;
				if (count > r) {return};

				c.send(JSON.stringify({who: "server=============ssssssssss" + Math.random()}));
			}
		}, 1000);

		done();
	});

	function createClient(h) {
		if (isStop) {
			return;
		};

		if (c > count) {
			return;
		};
		c++;

		var client = new WebSocket(h);
		client.on("open", function() {
			console.log("open");
			client.send(JSON.stringify({cmd: "subscribe"}));
		});
		client.on("message", function(data) {
			console.log(data);
		});
		client.on("error", function(e) {
			console.log("error", e);
		});
		client.on("close", function(e,d) {
			console.log("close", e,d);
		});
		// console.log(client);
	};
	
	it("ws client test", function (done) {

		return done();
		
		setInterval(function() {
			createClient(hostname);
		}, 500);
		setInterval(function() {
			createClient(hostname);
		}, 400);
		setInterval(function() {
			createClient(hostname);
		}, 300);
		setInterval(function() {
			createClient(hostname);
		}, 200);
		setInterval(function() {
			createClient(hostname);
		}, 100);
		
		done();
	});

	it("---- test server client ------", function() {
		
		var client = new WebSocket("ws://127.0.0.1:8888");
		client.on("open", function() {
			console.log("open");
			setInterval(function() {
				client.send(JSON.stringify("client message to server" + Math.random()));
			}, 1000);
		});
		client.on("message", function(data) {
			console.log(data);
		});
		client.on("error", function(e) {
			console.log("error", e);
		});
		client.on("close", function(e,d) {
			console.log("close", e,d);
		});
	});
	
});
