/**
 * @fileOverview Schema for Buses
 */

/**
 * @module Bus model
 */
var mongoose = require("mongoose");

var mongoSchema = mongoose.Schema;
/** @class **/
var bus = {
	/** unique bus number **/
	"bus_no": String,
	/** unique bus start stop ID **/
	"start_stop_id": String,
	/** unique bus end stop ID **/
	"end_stop_id": String,
};

module.exports = mongoose.model('buses', bus);;
