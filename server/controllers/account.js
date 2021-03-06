/**
 * @fileOverview Operations Related to User Registration, Login, Logout
 */

/**
 * Represents bus and has operations related to finding nearest bus Stop and estimated arrival time
 * @constructor
 * @param {Object} user - User mongoose schme
 * @param {Object} session - All entites for user session
 * @param {String} session.user_profile - Unique user token
 * @example
 * var account = new account_controller(User, {});
 */
var Account = function(user, session) {

	this.crypto = require('crypto');
	this.uuid = require('node-uuid');
	this.api_resp = require('../models/api_resp.js');
	this.api_error_messages = require('../models/api_error_messages.js');
	this.user_profile = require('../models/user_profile.js');
	/** @type {Object} */
	this.user = user;
	/** @type {Object} */
	this.session = session;
};


/**
 * Returns the user current session object
 * @returns {Object}
 * @example
 * var sess = account.getSession();
 */
Account.prototype.getSession = function() {
	return this.session;
};

/**
 * Set the user current session object
 * @params {Object} session
 * @example
 * account.setSession({});
 */
Account.prototype.setSession = function(session) {
	this.session = session;
};

/**
 * Encrypts the user password
 * @params {String} password Encrypted password from frontend
 * @params {function} callback Callback to execute
 * @params {String} salt Salt object for hashing
 * @example 
 * account.hashPassword(password, String(account.password_salt), function(err, passwordHash) {
 */
Account.prototype.hashPassword = function(password, salt, callback) {
	var iterations = 10000,
		keyLen = 64;
	this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
};

/**
 * Attempts a user login, and returns session object if successful
 * @params {String} password Encrypted password from frontend
 * @params {function} callback Callback to execute
 * @params {String} email Unique email-id identifying user
 * @returns {Object} 
 * @example 
 * account.login(email, password, function(err, resp) {res.json(response)});
 */
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

/**
 * Attempts a user logout, deleted user_profile object
 * @returns {null} 
 * @example 
 * account.logoff();
 */
Account.prototype.logoff = function() {
	if (this.session.user_profile) delete this.session.user_profile;
	return;
};

/**
 * Attempts a user registration, and returns session object if successful
 * @params {Object} newUser Details of the new users 
 * @params {String} newUser.email Unique user email
 * @params {String} newUser.name User name
 * @params {String} newUser.password Encrypted user password
 * @params {function} callback Callback to execute on error/success
 * @returns {Object} 
 * @example 
 * account.register(new_user, function(err, resp) {
 */
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
