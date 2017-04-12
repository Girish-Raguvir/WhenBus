/**
 * @fileOverview Operations Related to User Querries for Buses and Bus-stops
 */

/**
 * Represents bus and has operations related to finding nearest bus Stop and estimated arrival time
 * @constructor
 * @param {Number} user_lat - The latitude of the user
 * @param {Number} user_lon - The longitude of the user
 * @param {Number} dest_lat - The latitude of the user
 * @param {Number} dest_lon - The longitude of the user
 * @param {Object} stop_model - The schema of the stop database in Mongoose
 * @param {Object} bus_model - The schema of the stop database in Mongoose
 * @param {Object} route_model - The schema of the stop database in Mongoose
 * @example
 * var bus = new BusController(lat_u, lon_u, lat_d, lon_d, Stop_model, Bus_model, Route_model);
 */
var BusController = function(user_lat, user_lon, dest_lat, dest_lon, stop_model, bus_model, route_model) {
	/** @type {Number} */
	this.user_lat = user_lat;
	/** @type {Number} */
	this.user_lon = user_lon;
	/** @type {Number} */
	this.dest_lat = dest_lat;
	/** @type {Number} */
	this.dest_lon = dest_lon;
	/** @type {Object} */
	this.stop_model = stop_model;
	/** @type {Object} */
	this.bus_model = bus_model;
	/** @type {Object} */
	this.route_model = route_model;
	this.api_error_messages = require('../models/api_error_messages.js');
	this.heuristics_controller = require('../controllers/heuristics.js')

	this.deasync = require("deasync");

	/** @type {Number} */
	this.k = 3; 
};

/**
 * Calculates in Km, the distance of an given bus stop, to the co-ordinates of the user
 * @param {Object} stop - A collection(element) from the stop database for which we calculate distance from User coordinates
 * @returns {Number} 
 * @example
 * var Dist =  bus.getDistanceFromLatLon ({ "lat" : 12.989091, "lon" : 80.230755} {"lat" : 12.989091, "lon" : 80.230755 });
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
 * @returns {Number} 
 * @Example
 * var dLon = bus.deg2rad(170);
 */
BusController.prototype.deg2rad = function(deg) {
	return deg * (Math.PI / 180);
}

/**
 * Finds the bus stop closest to the user co-ordinates that also has requested bus passing through it
 * @param {Array} allstops - An array of stops(from the database)
 * @param {Array} callback - Callback function to execute(which returns a response) after closest stop is found
 * @returns {Object}
 */
BusController.prototype.findMin = function(allstops, callback) {
	var me = this;

	var num_stops = allstops.length;
	// Find the minimum by iterating
	var min_stop = allstops.reduce(function(min, s) {

		me.route_model.findOne({
			bus_no: me.bus_no,
			bus_stop: s.stop_id
		}, function(err, route) {
			if (err) {
				return callback(err, {
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
 * Finds the K-Nearest Bus stops from a reference location(ref_loc). Return them in Ascending order of distance.
 * @param {Array} allstops - An array of stops(from the database)
 * @param {Array} callback - Callback function to execute(which returns a response) after closest stop is found
 * @example 
 * var stops_near_user = me.getKNearestStop(stop, { "lat": "12.01323" , "lon": "80.31121 }, k);
 * @returns {Object}
 */
BusController.prototype.getKNearestStop = function(busstops, ref_loc, k) {
	var me = this;

	stop_dist = []
	for (var i = 0, len = busstops.length; i < len; i++) {
		stop_dist.push({
			"stop_id": busstops[i].stop_id,
			"stop_dist": me.getDistanceFromLatLon({
					"lat": busstops[i].gps_lat,
					"lon": busstops[i].gps_lon
				},
				ref_loc),
			"num_bus": 0,
			"bus_list": new Set()
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
 * @example 
 * bus.findBus(function(err, resp) {........});
 */
BusController.prototype.findBus = function(callback) {
	var me = this;
	var unlocked = false;
	var stops_near_user;
	var stops_near_dest;

	console.log("Started Heuristics Query")
	console.log("Getting bus stops near user and end point")

	// Find the candidate destination bus_stops(k)
	// Find the candidate source bus_stops(k)
	me.stop_model.find({}, function(err, stop) {
		if (err) {
			return callback(err, {
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

	me.deasync.loopWhile(function() {
		return !unlocked;
	});

	console.log("Finding candidate buses")

	for (var i = 0; i < stops_near_user.length; ++i) {
		var hold = true;
		me.route_model.find({
			"bus_stop": stops_near_user[i].stop_id
		}, function(err, routes) {
			if (err) {
				return callback(err, {
					success: false,
					payload: {
						msg: me.api_error_messages.database_error
					}
				});
			} else {
				for (var j = 0; j < routes.length; ++j) {
					for (var k = 0; k < stops_near_dest.length; ++k) {
						var lck = true;
						me.route_model.find({
							"bus_no": routes[j].bus_no,
							"bus_stop": stops_near_dest[k].stop_id
						}, function(err, path) {
							if (err) {
								return callback(err, {
									success: false,
									payload: {
										msg: me.api_error_messages.database_error
									}
								});
							} else {
								if (path.length > 0 && routes[j].stop_no < path[0].stop_no) {
									stops_near_user[i].num_bus += +1;
									stops_near_user[i].bus_list.add(path[0].bus_no);
								}
							}
							lck = false;
						});
						me.deasync.loopWhile(function() {
							return lck;
						});
					}
				}
			}
			hold = false;
		});

		me.deasync.loopWhile(function() {
			return hold;
		});
	}

	// Get the best user Bus Stop
	var best_user_stop = -1;
	for (var i = 0; i < stops_near_user.length; ++i) {
		if (stops_near_user[i].num_bus > 0) {
			best_user_stop = i;
			break;
		}
	}

	if (best_user_stop == -1) {
		return callback(0, {
			success: false,
			payload: {
				msg: me.api_error_messages.no_nearby_stop
			}
		});
	}

	var heuristics = new me.heuristics_controller(
		0.0,
		0.0,
		null,
		stops_near_user[best_user_stop].stop_id,
		me.route_model,
		me.stop_model);

	bus_and_timings = []
	var mutex = stops_near_user[best_user_stop].bus_list.size;

	console.log("Calculating Heuristics..");

	stops_near_user[best_user_stop].bus_list.forEach(function(cur_bus) {

		var ret_val = null;
		ret_val = heuristics.query(cur_bus, callback);

		me.deasync.loopWhile(function() {
			return (ret_val == null);
		});

		if (!ret_val.success) {
			return callback(err, {
				success: false,
				payload: {
					msg: ret_val.payload.msg
				}
			});
		} else {
			bus_and_timings.push({
				"bus_no": cur_bus,
				"arrival_time": ret_val.payload.time
			});
		}
	});


	var user_stop_return;
	var locked = true;
	me.stop_model.find({
		stop_id: stops_near_user[best_user_stop].stop_id
	}, function(err, stop) {
		if (err) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		} else {
			user_stop_return = {
				"lat": stop[0].gps_lat,
				"lon": stop[0].gps_lon,
				"name" : stop[0].stop_name,
				"id" : stop[0].stop_id
			}
		}
		locked = false;
	});

	me.deasync.loopWhile(function() {
		return locked;
	});

	console.log("Returning result")
	return callback(0, {
		success: true,
		payload: {
			stop_lat: user_stop_return.lat,
			stop_lon: user_stop_return.lon,
			stop_id: user_stop_return.id,
			stop_name: user_stop_return.name,
			bus_details: bus_and_timings
		}
	});


};

/**
 * Get the endpoints of a particular bus stop
 * @param {Object} callback - Callback function to execute(which returns a response) after closest stop is found
 * @example 
 * bus.findBus("IITM1", function(err, resp) {.....});
 */
BusController.prototype.getBusDirection = function(raw_bus, callback) {
	var me = this;
	var unlocked = false;
	var start_stop ;
	var end_stop ;

	me.bus_model.find({bus_no : raw_bus + "_f"}, function(err, buses) {
		if (err) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		} else {
			start_stop = buses[0].start_stop_id,
			end_stop =  buses[0].end_stop_id,
			unlocked = true;
		}
	});

	me.deasync.loopWhile(function() {
		return !unlocked;
	});

	start_stop_list = [start_stop, end_stop];
	bus_list = [raw_bus + "_f" , raw_bus + "_b"];
	start_stop_names = [];
	start_stop_gps_lat = [];
	start_stop_gps_lon = [];

	for (var i = 0; i < 2; ++i) {
		unlocked = false;
		me.stop_model.find({stop_id : start_stop_list[i]}, function(err, buses) {
			if (err) {
				return callback(err, {
					success: false,
					payload: {
						msg: me.api_error_messages.database_error
					}
				});
			} else {
				start_stop_names.push(buses[0].stop_name);
				start_stop_gps_lat.push(buses[0].gps_lat);
				start_stop_gps_lon.push(buses[0].gps_lon);
				unlocked = true;
			}
		});

		me.deasync.loopWhile(function() {
			return !unlocked;
		});
	}


	return callback(0, {
		success: true,
		payload: {
			bus1 : {
				bus_name : bus_list[0],
				start_stop : start_stop_names[0],
				end_stop :start_stop_names[1]
			},
			bus2 : {
				bus_name : bus_list[1],
				start_stop : start_stop_names[1],
				end_stop :start_stop_names[0]
			}
		}
	});

	

};

module.exports = BusController;
