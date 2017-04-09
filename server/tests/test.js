var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('./config-debug');

describe('Routing', function() {
	var url = "localhost:3000";
	before(function(done) {
		mongoose.connect(url);
		conn.on('error', console.error.bind(console, 'connection error:'));

		done();
	});

	var conn = mongoose.connection;

	describe('Account', function() {
		it('Try incorrect login', function(done) {
			var profile = {
				email 'sample@iitm.ac.in',
				password: 'simple',
			};

			request(url)
				.post('/users/login')
				.send(profile)
				// end handles the response
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// this is should.js syntax, very clear
					res.should.have.status(200);
					done();
				});
		});
		it('should correctly update an existing account', function(done) {
			var body = {
				firstName: 'JP',
				lastName: 'Berd'
			};
			request(url)
				.put('/api/profiles/vgheri')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200) //Status code
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// Should.js fluent syntax applied
					res.body.should.have.property('_id');
					res.body.firstName.should.equal('JP');
					res.body.lastName.should.equal('Berd');
					res.body.creationDate.should.not.equal(null);
					done();
				});
		});
	});
});
