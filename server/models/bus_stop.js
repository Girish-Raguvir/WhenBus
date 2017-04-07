/**
 * @fileOverview Schema for Bus Stop
 */

/**
 * @module Bus Stop Model
 */
var mongoose = require("mongoose");


var mongoSchema = mongoose.Schema;
/** @class **/
var bus_stop = {
	/** unique bus stop ID **/
	"stop_id": String,
	/** unique bus stop name **/
	"stop_name": String,
	/** Latitude of  bus stop **/
	"gps_lat": Number,
	/** Longitude of  bus stop **/
	"gps_lon": Number
};

module.exports = mongoose.model('bus_stops', bus_stop);;
