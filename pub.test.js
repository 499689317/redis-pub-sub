var redis = require("redis");

describe("pub test", function() {

	var ip = "127.0.0.1";
	var port = 6379;
	var chan1 = "test1";
	var chan2 = "test2";
	var chan3 = "test3";
	var chan4 = "test4";
	var chan5 = "test5";
	it("redis publish test", function(done) {
		var client = redis.createClient(port, ip);
		client.on("ready", function() {
			console.log("publish ready");
		});
		client.on("error", function(e) {
			console.error("pub error", e);
		});

		setInterval(function() {
			client.publish(chan1, "11111111111111111111111111111111111111111111111111111111"+Math.random());
		}, 500);
		setInterval(function() {
			client.publish(chan2, "22222222222222222222222222222222222222222222222222222222"+Math.random());
		}, 400);
		setInterval(function() {
			client.publish(chan3, "33333333333333333333333333333333333333333333333333333333"+Math.random());
		}, 300);
		setInterval(function() {
			client.publish(chan4, "44444444444444444444444444444444444444444444444444444444"+Math.random());
		}, 200);
		setInterval(function() {
			client.publish(chan5, "55555555555555555555555555555555555555555555555555555555"+Math.random());
		}, 100);
		done();
	});
	
});
