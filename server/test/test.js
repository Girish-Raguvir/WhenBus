var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var users = require('../models/user.js')
var deasync = require("deasync");

describe('User account', function() {
	db_url = 'mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus'
	url = 'localhost:3000'
	before(function(done) {
		mongoose.connect(db_url)
		conn.on('error', console.error.bind(console, 'connection error:'));
		done();
	});

	after(function(done) {
		conn.on('error', console.error.bind(console, 'connection error:'));
		done();
	});

	var conn = mongoose.connection;

	describe('Login', function() {
		it('Incorrect login ID', function(done) {
			var profile = {
				email :'invalid@whenbus.in',
				password: 'simple'
			};

			request(url)
				.post('/users/login')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.msg.should.equal(3);
					done();
				});
		});
		it('Incorrect login passsword', function(done) {
			var profile = {
				email :'sample@whenbus.in',
				password: 'simplex'
			};

			request(url)
				.post('/users/login')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.msg.should.equal(1);
					done();
				});
		});
		it('Check successful login', function(done) {
			var profile = {
				email :'correct@whenbus.in',
				password: 'simple'
			};

			request(url)
				.post('/users/login')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.success.should.equal(true);
					res.body.message.user_profile.name.should.equal("test");
					res.body.message.user_profile.email.should.equal("correct@whenbus.in");
					done();
				});
		});
	});
	describe('Registration', function() {

		beforeEach(function(done) {
			// Remove newly registered used every time for correctness
			var locked = true;
			users.remove({
				email: "new_user@whenbus.in",
			}, function(err, ob) {
				assert(!err)
				locked = false;
			})

			deasync.loopWhile(function() {
				return locked;
			});
			done();
		});
		it('Register new user', function(done) {
			 var profile = {
				"email" : "new_user@whenbus.in",
				"password": "simple",
				"name" : "test"
			};
			request(url)
				.post('/users/register')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.user_profile.name.should.equal("test");
					res.body.message.user_profile.email.should.equal("new_user@whenbus.in");
					res.body.success.should.equal(true);
					done();
				});
		});
		it('Invalid registration', function(done) {
			 var profile = {
				"email" : "sample@whenbus.in",
				"password": "simple",
				"name" : "test"
			};
			request(url)
				.post('/users/register')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.msg.should.equal(4);
					res.body.success.should.equal(false);
					done();
				});
		});
	});
});

describe('Heuristic Update', function() {
	// db_url = 'mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus'
	url = 'localhost:3000'

	var conn = mongoose.connection;

	describe('Successful Update', function() {
		it('Successful update', function(done) {
			var profile = {
				"gps_lon": 80.242446,
				"gps_lat": 13.005970,
				"bus_no": "IITM1_f",
				"bus_stop": "15"
			};

			request(url)
				.post('/heuristics')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.msg.should.equal("success");
					res.body.success.should.equal(true);
					done();
				});
		});
	});

	describe('Failed Update', function() {
		it('Wrong Stop', function(done) {
			var profile = {
				"gps_lon": 80.242446,
				"gps_lat": 13.005970,
				"bus_no": "IITM1_f",
				"bus_stop": "16"
			};

			request(url)
				.post('/heuristics')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.should.equal("Error");
					res.body.success.should.equal(false);
					done();
				});
		});
		it('Wrong Bus', function(done) {
			var profile = {
				"gps_lon": 80.242446,
				"gps_lat": 13.005970,
				"bus_no": "IITM3_f",
				"bus_stop": "15"
			};

			request(url)
				.post('/heuristics')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.should.equal("Error");
					res.body.success.should.equal(false);
					done();
				});
		});
		it('Wrong Stop and Bus', function(done) {
			var profile = {
				"gps_lon": 80.242446,
				"gps_lat": 13.005970,
				"bus_no": "IITM3_f",
				"bus_stop": "17"
			};

			request(url)
				.post('/heuristics')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.should.equal("Error");
					res.body.success.should.equal(false);
					done();
				});
		});
	});
});

describe('Bus and Stop Query', function() {
	// db_url = 'mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus'
	url = 'localhost:3000'

	var conn = mongoose.connection;

	describe('Get endpoint', function() {
		it('Bus direction', function(done) {
			var profile = {
				"bus_no": "IITM1"
			};

			request(url)
				.post('/endstops')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.should.property("bus1");
					res.body.message.should.property("bus2");
					res.body.success.should.equal(true);
					done();
				});
		});
		it('Failed Bus direction', function(done) {
			var profile = {
				"bus_no": "IITaM1"
			};

			request(url)
				.post('/endstops')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.message.msg.should.equal(6);
					res.body.success.should.equal(false);
					done();
				});
		});
	});

	describe('Make Query', function() {
		it('Success Query', function(done) {
			var profile = {
				"gps_lat_u": 12.989091,
				"gps_lon_u": 80.230755,
				"gps_lat_d": 12.989091,
				"gps_lon_d": 80.230755
			};

			request(url)
				.post('/bus')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.status.should.be.equal(200);
					res.body.success.should.equal(true);
					res.body.message.should.property("stop_lat");
					res.body.message.should.property("stop_lon");
					res.body.message.should.property("stop_name");
					res.body.message.should.property("bus_details");
					done();
				});
		});
	});
});
