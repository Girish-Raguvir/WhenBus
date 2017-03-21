var Account = function(user, session) {

	this.crypto = require('crypto');
	this.uuid = require('node-uuid');
	this.api_resp = require('../models/api_resp.js');
	this.api_error_messages = require('../models/api_error_messages.js');
	this.user_profile = require('../models/user_profile.js');
	this.user = user;
	this.session = session;
};

Account.prototype.getSession = function() {
	return this.session;
};

Account.prototype.setSession = function(session) {
	this.session = session;
};

Account.prototype.hashPassword = function(password, salt, callback) {
	var iterations = 10000,
		keyLen = 64;
	this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
};

Account.prototype.login = function(email, password, callback) {

	var me = this;

	me.user.findOne({
		email: email
	}, function(err, user) {

		if (err) {
			return callback(err, new me.api_resp({
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			}));
		}

		if (user) {
			me.hashPassword(password, String(user.password_salt), function(err, passwordHash) {

				if (passwordHash == user.password_hash) {

					var user_profile = new me.user_profile({
						email: user.email,
						name: user.name
					});

					me.session.user_profile = user_profile;

					return callback(err, new me.api_resp({
						success: true,
						payload: {
							user_profile: user_profile
						}
					}));

				} else {
					return callback(err, new me.api_resp({
						success: false,
						payload: {
							msg: me.api_error_messages.invalid_password
						}
					}));
				}
			});

		} else {
			return callback(err, new me.api_resp({
				success: false,
				payload: {
					msg: me.api_error_messages.not_found
				}
			}));
		}

	});
};

Account.prototype.logoff = function() {
	if (this.session.user_profile) delete this.session.user_profile;
	return;
};

Account.prototype.register = function(newUser, callback) {

	var me = this;

	me.user.findOne({
		email: newUser.email
	}, function(err, user) {

		if (err) {
			return callback(err, new me.api_resp({
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			}));
		}

		if (user) {
			return callback(err, new me.api_resp({
				success: false,
				payload: {
					msg: me.api_error_messages.email_already_exists
				}
			}));
		} else {

			newUser.save(function(err, user, numberAffected) {

				if (err) {
					return callback(err, new me.api_resp({
						success: false,
						payload: {
							msg: me.api_error_messages.database_error
						}
					}));
				}

				if (numberAffected === 1) {

					var user_profile = new me.user_profile({
						email: user.email,
						name: user.name
					});

					return callback(err, new me.api_resp({
						success: true,
						payload: {
							user_profile: user_profile
						}
					}));

				} else {
					return callback(err, new me.api_resp({
						success: false,
						payload: {
							msg: me.api_error_messages.user_create_error
						}
					}));
				}

			});
		}

	});
};

module.exports = Account;
