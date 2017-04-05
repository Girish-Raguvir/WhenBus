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
var BusController = function(user_lat, user_lon, dest_lat, dest_lon, stop_model, bus_model, route_model) {
	this.user_lat = user_lat;
	this.user_lon = user_lon;
	this.dest_lat = dest_lat;
	this.dest_lon = dest_lon;
	this.stop_model = stop_model;
	this.bus_model = bus_model;
	this.route_model = route_model;
	this.api_error_messages = require('../models/api_error_messages.js');
	this.deasync = require("deasync");
	this.k = 3
};

/**
 * Calculates in Km, the distance of an given bus stop, to the co-ordinates of the user
 * @param {Object} stop - A collection(element) from the stop database for which we calculate distance from User coordinates
 */
BusController.prototype.getDistanceFromLatLon = function(gps1, gps2) {
	var R = 6371; // Radius of the earth in km
	var dLat = this.deg2rad(gps1.lat - gps2.lat);
	var dLon = this.deg2rad(gps1.lon - gps2.lon);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(this.deg2rad(gps2.lat)) * Math.cos(this.deg2rad(gps1.lat)) *
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

BusController.prototype.getKNearestStop = function(busstops, ref_loc, k) {
	var me = this;

	stop_dist = []
	for (var i = 0, len = busstops.length; i < len; i++) {
		stop_dist.push({
			"stop_no": busstops[i].stop_id,
			"stop_dist": me.getDistanceFromLatLon({
					"lat": busstops[i].gps_lat,
					"lon": busstops[i].gps_lon
				},
				ref_loc)
		});
	}
	stop_dist.sort(function(a, b) {
		return parseFloat(a.stop_dist) - parseFloat(b.stop_dist);
	});

	return stop_dist.slice(0, k);
}

/**
 * Checks if bus requested is valid, and finds the bus stop closest to to the user via which requested bus passes through
 * @param {Array} callback - Callback function to execute(which returns a response) after closest stop is found
 */
BusController.prototype.findStop = function(callback) {
	var me = this;
	var unlocked = false;
	var stops_near_user;
	var stops_near_dest;

	console.log("Started")

	// Find the candidate destination bus_stops(k)
	// Find the candidate source bus_stops(k)
	me.stop_model.find({}, function(err1, stop) {
		if (err1) {
			return callback(err1, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		} else {
			stops_near_user = me.getKNearestStop(stop, {
				"lat": me.user_lat,
				"lon": me.user_lon
			}, me.k);

			stops_near_dest = me.getKNearestStop(stop, {
				"lat": me.dest_lat,
				"lon": me.dest_lon
			}, me.k);
			unlocked = true;
		}
	});

	this.deasync.loopWhile(function() {
		return !unlocked;
	});

	console.log(stops_near_user)
	console.log(stops_near_dest)
	console.log("Got bus stops near user and end point")

	// find buses going through any candidate-source ----> candidate-dest.

	// For all buses such that  (src_gps - src_bus)^2 + (dest_gps - dest_stop)^2 is min

	// 



};

module.exports = BusController;
