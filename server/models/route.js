/**
 * @fileOverview Schema for Bus routes
 */

/**
 * @module Route model
 */
var mongoose = require("mongoose");


var mongoSchema = mongoose.Schema;
/** @class **/
var route = {
	/** unique bus stop number **/
	"bus_stop": String,
	/** unique bus number **/
	"bus_no": String,
	/** stop position along the bus route **/
	"stop_no": Number,
	/** Array of timings indicating when bus stops and particular bus stop**/
	"timings": Array
};

module.exports = mongoose.model('routes', route);
