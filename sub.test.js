var redis = require("redis");
var http = require("http");
var WebSocket = require("ws");

describe("ws sub test", function() {

	var hostname = "ws://127.0.0.1:8080/";
	var ip = "127.0.0.1";
	var chan = "test*";
	var port = 6379;
	var count = 12000;// 12000连接数，符合之前压测结果，实际macpro(cpu corei7,mem 16g,单进程)上可以到16000
	var isStop = false;

	it("ws ============= sub ========== test", function (done) {

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


		var client = redis.createClient(port, ip);
		client.on("ready", function() {
			console.log("psubscribe ready");
		});
		client.on("error", function(e) {
			console.error("psub error",e);
		});
		client.on("psubscribe", function(channel, count) {
			console.log(`psubscribe ==== channel: ${channel}, count: ${count}`);
		});
		client.on("pmessage", function(patt, channel, message) {
			// console.log(`publish message ==== patt: ${patt}, channel: ${channel}, message: ${message}`);

			wss.clients.forEach(function(c) {
				c.send(JSON.stringify(message));
			});
		});
		client.psubscribe(chan);

		// setInterval(function() {
		// 	wss.clients.forEach(function(c) {
		// 		c.send("111111111111111111111111111111111111111111111111111111"+Math.random());
		// 	});
		// },100);
		// setInterval(function() {
		// 	wss.clients.forEach(function(c) {
		// 		c.send("2222222222222222222222222222222222222222222222222222222"+Math.random());
		// 	});
		// },200);
		// setInterval(function() {
		// 	wss.clients.forEach(function(c) {
		// 		c.send("333333333333333333333333333333333333333333333333333333"+Math.random());
		// 	})
		// },300);
		// setInterval(function() {
		// 	wss.clients.forEach(function(c) {
		// 		c.send("444444444444444444444444444444444444444444444444444444"+Math.random());
		// 	});
		// }, 400);
		// setInterval(function() {
		// 	wss.clients.forEach(function(c) {
		// 		c.send("555555555555555555555555555555555555555555555555555555"+Math.random());
		// 	});
		// },500);

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

		done();
	});
	
});
