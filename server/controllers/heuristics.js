/**
 * @fileOverview Operations Related to Heuristics
 */

/**
 * Handles heuristics realted operations
 * @constructor
 * @param {Number} user_lat - The latitude of the user
 * @param {Number} user_lon - The longitude of the user
 * @param {String} bus_no - Bus number
 * @param {String} bus_stop - Bus stop
 * @param {Object} route_model - The schema of the stop database in Mongoose
 * @param {Object} stop_model - The schema of the stop database in Mongoose
 * @example
 * var heuristics = new heuristics_controller = function(lat, lon, bus_no, bus_stop, route_model, stop_model);
 */
var heuristics_controller = function(lat, lon, bus_no, bus_stop, route_model, stop_model) {
	this.lat = lat;
	this.lon = lon;
	this.bus_no = bus_no;
	this.bus_stop = bus_stop;
	this.route_model = route_model;
	this.stop_model = stop_model;
	this.api_error_messages = require('../models/api_error_messages.js');
	this.find_travel_info = require('./google_distance.js')
	this.deasync = require("deasync");
};

/**
 * Returns a JSON containing the next arrival time of the queried bus at the bus stop already chosen for the user
 * @param {String} bus_no - Bus number
 * @param {function} callback Callback to execute on error/success
 * @returns {Object}
 * @example
 * heuristics.query(query_bus_no, callback);
 */
heuristics_controller.prototype.query = function(query_bus_no, callback) {
	var me = this;

	var lock = true;
	var time_bus;

	me.route_model.findOne({
		bus_stop: String(me.bus_stop),
		bus_no: String(query_bus_no)
	}, function(err, route) {

		if (err) {
			return callback({
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		}

		if (!route.length) {
			return callback({
				success: false,
				payload: {
					msg: me.api_error_messages.bus_stop_not_found
				}
			});
		}

		var f = 0;
		var currentTime = new Date();
		var currentOffset = currentTime.getTimezoneOffset();
		var ISTOffset = 330;   // IST offset UTC +5:30
		var dt = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
		var curr_time = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());

		for (var i = 0; i < route.timings.length; i++) {
			if (route.timings[i] > curr_time) {
				f = i;
				break;
			}
		}

		time_bus = String(Math.floor(route.timings[f] / 3600)) + ":" + String(Math.floor((route.timings[f] % 3600) / 60))
		lock = false;

	});

	me.deasync.loopWhile(function() {
		return lock;
	});

	return {
		success: true,
		payload: {
			bus_stop: me.bus_stop,
			bus_no: query_bus_no,
			time: time_bus
		}
	};
}

/**
 * Returns a JSON containing the bus stop location
 * @param {String} bus_no - Bus number
 * @param {String} stop_no - Stop ID
 * @param {function} callback Callback to execute on error/success
 * @returns {Object}
 * @example
 * heuristics.find_bus_stop_location(bus_no, stop_no, callback);
 */

 heuristics_controller.prototype.find_bus_stop_location = function(bus_no, stop_no, callback) {
	var me = this;

	me.route_model.findOne({
		bus_no: bus_no,
		stop_no: stop_no
	}, function(err, route) {

		if (err) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error + " " + stop_no
				}
			});
		} else if (!route) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.bus_stop_not_found + " " + stop_no
				}
			});
		}

		// console.log(bus_no);
		// console.log(stop_no);
		// console.log(route);

		bus_stop = route.bus_stop;

		me.stop_model.findOne({
			stop_id: bus_stop
		}, function(err, stop) {
			if (err) {
				return callback(err, {
					success: false,
					payload: {
						msg: me.api_error_messages.database_error
					}
				});
			}
			if (stop) {
				return callback(err, {
					lat: stop.gps_lat,
					lon: stop.gps_lon
				});
			}

			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.bus_stop_not_found
				}
			});

		});
	});
}

/**
 * Uppdates the timing for a given <bus_np, stop_no> pair using the given time
 * @param {String} stop_no - Stop ID
 * @param {String} bus_no - Bus number
 * @param {Number} time - The one used to update the heuristics
 * @param {function} callback Callback to execute on error/success
 * @returns {Object}
 * @example
 * heuristics.update_timing(stop_no, bus_no, time, callback);
 */
heuristics_controller.prototype.update_timing = function(stop_no, bus_no, time, callback) {
	var me = this;

	me.route_model.findOne({
		stop_no: stop_no,
		bus_no: bus_no
	}, function(err, route) {

		if (err) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		}

		// console.log(stop_no);
		// console.log(bus_no);

		if (!route) {
			return callback(err, {
				success: false,
				payload: {
					msg: "not found"
				}
			});
		}

		var f = 0;

		for (var i = 0; i < route.timings.length; i++) {
			if (route.timings[i] > time) {
				f = i - 1;
				break;
			}
		}

		if (f == -1) f = route.timings.length - 1;


		route.timings[f] = 0.8 * route.timings[f] + 0.2 * time;

		route.markModified('timings');

		route.save(route, function(err) {
			if (err) {
				return callback(err, {
					success: false,
					payload: {
						msg: me.api_error_messages.database_error
					}
				});
			} else {
				return callback(err, {
					success: true,
					payload: route
				});
			}
		});

	});
}

/**
 * Updates heuristics
 * @param {function} callback Callback to execute on error/success
 * @returns {Object}
 * @example
 * heuristics.update(callback);
 */
heuristics_controller.prototype.update = function(callback) {

	var me = this;

	me.route_model.findOne({
		bus_no: me.bus_no,
		bus_stop: me.bus_stop
	}, function(err, route) {

		if (err) {
			return callback(err, {
				success: false,
				payload: {
					msg: me.api_error_messages.database_error
				}
			});
		}

		var bus_stop = route.bus_stop;
		var stop_no = route.stop_no;
		var f = 1;
		// console.log(route);

		for (var i = stop_no;; i++) {


			// console.log(i);

			var lock = true;


			var currentTime = new Date();
			var currentOffset = currentTime.getTimezoneOffset();
			var ISTOffset = 330;   // IST offset UTC +5:30
			var dt = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

			var curr_time = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());

			me.find_bus_stop_location(me.bus_no, i, function(err, resp) {

				// console.log(resp);

				if (resp.success == false) {
					return callback(err, {
						success: true,
						payload: {
							msg: "success"
						}
					});
				} else {
					// console.log(me.lon);
					// console.log(me.lat);

					end = resp.lat.toString() + "," + resp.lon.toString();
					start = me.lat.toString() + "," + me.lon.toString();

					me.find_travel_info(start, end, 'transit', function(err, resp) {
						if (err) {
							return callback(err, {
								success: false,
								payload: {
									msg: me.api_error_messages.database_error
								}
							});
						}

						travel_time = resp.durationValue;

						var updated_time = curr_time + travel_time;

						// console.log(curr_time);
						// console.log(travel_time);
						// console.log(updated_time);

						me.update_timing(i, me.bus_no, updated_time, function(err, resp) {

							// console.log(resp);

							if (err) {
								return callback(err, {
									success: false,
									payload: {
										msg: me.api_error_messages.database_error
									}
								});
							}

							lock = false;
						});
					});
				}
			});

			me.deasync.loopWhile(function() {
				return lock;
			});
		}

		return callback(err, {
			success: true,
			payload: {
				msg: "success"
			}
		});

	});
};

module.exports = heuristics_controller;
