var BusController = function(lat, lon, bus_no, stop_model, bus_model, route_model) {
	this.lat = lat;
	this.lon = lon;
	this.bus_no = bus_no.toUpperCase();
	this.stop_model = stop_model;
	this.bus_model = bus_model;
	this.route_model = route_model;
};

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

BusController.prototype.deg2rad = function(deg) {
	return deg * (Math.PI / 180);
}

BusController.prototype.findMin = function(allstops, callback) {
	var me = this;

	var num_stops = allstops.length;
	console.log(num_stops);
	var min_stop = allstops.reduce(function(min, s) {
		console.log(min.counter);

		me.route_model.findOne({
			bus_no: me.bus_no,
			bus_stop: s.stop_id
		}, function(err2, route) {
			if (err2) {
				return callback(err2, {
					success: false,
					payload: {
						msg: "Database error occured"
					}
				});
			} else if (route) {
				var cur_dist = me.getDistanceFromLatLon(s);
				if (min.d > cur_dist) {
					min.d = cur_dist;
					min.stp = s;
				}
			}
			min.counter = min.counter + 1;

			console.log(min);
			if (num_stops == min.counter) {
				console.log(min.counter);
				if (min.d == Infinity) {
					return callback(0, {
						success: false,
						payload: {
							msg: "No nearby bus stops through which requested bus passes through"
						}
					});
				} else {
					return callback(0, {
						success: true,
						payload: {
							msg: "Success",
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
					msg: "Database error occured"
				}
			});
		}
		if (!bus) {
			return callback(err, {
				success: false,
				payload: {
					msg: "Bus No. does not exist in the database."
				}
			});
		} else {
			// Find the nearest bus
			me.stop_model.find({}, function(err1, stop) {
				if (err1) {
					return callback(err1, {
						success: false,
						payload: {
							msg: "Database error occured"
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
