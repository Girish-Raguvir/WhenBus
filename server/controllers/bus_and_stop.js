/**
 * Represents bus and has operations related to finding nearest bus Stop and estimated arrival time
 * @constructor
 * @param {Number} lat - The latitude of the user
 * @param {Number} lon - The longitude of the user
 * @param {String} bus_no - The bus number that the user want to query for
 * @param {Object} stop_model - The schema of the stop database in Mongoose
 * @param {Object} bus_model - The schema of the stop database in Mongoose
 * @param {Object} route_model - The schema of the stop database in Mongoose
 */
var BusController = function(lat, lon, bus_no, stop_model, bus_model, route_model) {
	this.lat = lat;
	this.lon = lon;
	this.bus_no = bus_no.toUpperCase();
	this.stop_model = stop_model;
	this.bus_model = bus_model;
	this.route_model = route_model;
	this.api_error_messages = require('../models/api_error_messages.js');
};

/**
 * Calculates in Km, the distance of an given bus stop, to the co-ordinates of the user
 * @param {Object} stop - A collection(element) from the stop database for which we calculate distance from User coordinates
 */
BusController.prototype.getDistanceFromLatLon = function(stop) {
	var R = 6371; // Radius of the earth in km
	var dLat = this.deg2rad(this.lat - stop.gps_lat);
	var dLon = this.deg2rad(this.lon - stop.gps_lon);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(this.deg2rad(stop.gps_lat)) * Math.cos(this.deg2rad(this.lat)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

/**
 * Convert degrees to radians
 * @param {Number} deg - Angle in degrees
 */
BusController.prototype.deg2rad = function(deg) {
	return deg * (Math.PI / 180);
}

/**
 * Finds the bus stop closest to the user co-ordinates that also has requested bus passing through it
 * @param {Array} allstops - An array of stops(from the database) 
 * @param {Array} callback - Callback function to execute(which returns a response) after closest stop is found
 */
BusController.prototype.findMin = function(allstops, callback) {
	var me = this;

	var num_stops = allstops.length;
	// Find the minimum by iterating
	var min_stop = allstops.reduce(function(min, s) {

		me.route_model.findOne({
			bus_no: me.bus_no,
			bus_stop: s.stop_id
		}, function(err2, route) {
			if (err2) {
				return callback(err2, {
					success: false,
					payload: {
						msg: me.api_error_messages.database_error
					}
				});
			} else if (route) {
				// update minima
				var cur_dist = me.getDistanceFromLatLon(s);
				if (min.d > cur_dist) {
					min.d = cur_dist;
					min.stp = s;
				}
			}
			min.counter = min.counter + 1;

			// if all stops processed then return minima if it exists
			if (num_stops == min.counter) {
				if (min.d == Infinity) {
					return callback(0, {
						success: false,
						payload: {
							msg: me.api_error_messages.no_nearby_stop
						}
					});
				} else {
					return callback(0, {
						success: true,
						payload: {
							gps_lat: min.stp.gps_lat,
							gps_lon: min.stp.gps_lon,
							stop_name: min.stp.stop_name,
							time: "06:00"
						}
					});
				}
			}

		});

		return min;
	}, {
		d: Infinity,
		stp: {},
		counter: 0
	});

}

/**
 * Checks if bus requested is valid, and finds the bus stop closest to to the user via which requested bus passes through
 * @param {Array} callback - Callback function to execute(which returns a response) after closest stop is found
 */
BusController.prototype.findStop = function(callback) {
	var me = this;

	// Check if bus exists in database
	me.bus_model.findOne({
		bus_no: me.bus_no
	}, function(err, bus) {
		if (err) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		}
		if (!bus) {
			// Bus does not exist
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.bus_not_found
				}
			});
		} else {
			// Find the nearest bus
			me.stop_model.find({}, function(err1, stop) {
				if (err1) {
					return callback(err1, {
						success: false,
						payload: {
							msg: me.api_error_messages.database_error
						}
					});
				} else {
					me.findMin(stop, callback);
				}
			});
		}
	});

};

module.exports = BusController;
