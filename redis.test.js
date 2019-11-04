var redis = require("redis");

describe("redis test", function() {

	var ip = "127.0.0.1";
	var port = 6379;
	var chan1 = "chan1";
	var chan2 = "ch2";
	var chan3 = "chan3";
	var chan4 = "chan*";
	var chan5 = "ch2*";
	it("redis publish test", function(done) {
		var client = redis.createClient(port, ip);
		client.on("ready", function() {
			console.log("publish ready");
		});
		client.on("error", function(e) {
			console.error("pub error", e);
		});

		setInterval(function() {
			client.publish(chan1, Math.random());
		}, 500);
		setInterval(function() {
			client.publish(chan3, "Math.random()");
		}, 400);
		setInterval(function() {
			client.publish(chan2, "==============");
		}, 300);
		done();
	});
	it("redis subscribe test", function (done) {
		return done();
		var client = redis.createClient(port, ip);
		client.on("ready", function() {
			console.log("subscribe ready");
		});
		client.on("error", function(e) {
			console.error("sub error",e);
		});
		client.on("subscribe", function(channel, count) {
			console.log(`subscribe ====== channel: ${channel}, count: ${count}`);
		});
		client.on("message", function(channel, message) {
			console.log(`publish message1 ====== channel: ${channel}, message: ${message}`);
		});
		client.subscribe(chan1);
		client.subscribe(chan2);

		done();
	});


	function createClient(port, ip) {
		var client = redis.createClient(port, ip);
	};


	it("redis subscribe2 test", function(done) {
		return done();
		var client = redis.createClient(port, ip);
		client.on("ready", function() {
			console.log("subscribe2 ready");
		});
		client.on("error", function() {
			console.error("sub2 error",e);
		});
		client.on("subscribe", function(channel, count) {
			console.log(`subscribe2 ====== channel: ${channel}, count: ${count}`);
		});
		client.on("message", function(channel, message) {
			console.log(`publish message2 ===== channel: ${channel}, message: ${message}`);
		});
		client.subscribe(chan1, chan3);
		done();
	});
	
	it("redis psubscribe test", function (done) {
		return done();
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
			console.log(`publish message3 ==== patt: ${patt}, channel: ${channel}, message: ${message}`);
		});
		client.psubscribe(chan4, chan5);

		// client.set("test_sub", "1234");
		// client.publish("chan4", "test chan4");

		done();
	});
	
});
