/**
 * @fileOverview Schema for Users 
 */

/**
 * @module User model
 */
var mongoose = require("mongoose");

var mongoSchema = mongoose.Schema;
/** @class **/
var user_schema = {
	/** user name **/
	"name": String,
	/** unique user email **/
	"email": String,
	/** Hashed user password**/
	"password_hash": String,
	/** password salt for encrypting **/
	"password_salt": String
};

module.exports = mongoose.model('user_login', user_schema);;
