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
