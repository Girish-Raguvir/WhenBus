var BusController = function(lat, lon, bus_no, stop_model, bus_model, route_model) {
	this.lat = lat;
	this.lat = lat;
	this.bus_no = bus_no.toUpperCase();
	this.stop_model = stop_model;
	this.bus_model = bus_model;
	this.route_model = route_model;
};

BusController.prototype.getDistanceFromLatLon = function(lat1, lon1) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(this.lat - lat1); // deg2rad below
	var dLon = deg2rad(this.lon - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(this.lat)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

BusController.prototype.deg2rad = function(deg) {
	return deg * (Math.PI / 180);
}

BusController.prototype.findStop = function(callback) {

	// Check if bus exists in database
	this.bus_model.findOne({
		bus_no: this.bus_no
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
		}
	});

	// var closest_stop = new this.stop_model();
	var min_dist = Infinity
	// Find the nearest bus
	this.stop_model.find({}, function(err1, stop) {
		if (err1) {
			return callback(err1, {
				success: false,
				payload: {
					msg: "Database error occured"
				}
			});
		}

		var cur_dist = this.getDistanceFromLatLon(stop.gps_lat, stop.gps_lon);
		this.route_model.findOne({
			bus_no: this.bus_no,
			bus_stop: stop_id
		}, function(err2, route) {
			if (err2) {
				return callback(err2, {
					success: false,
					payload: {
						msg: "Database error occured"
					}
				});
			} else if (route) {
				if (min_dist > cur_dist) {
					closest_stop = stop;
					min_dist = cur_dist;
				}
			}
		});

	});

	if (min_dist == Infinity) {
		return callback(err, {
			success: false,
			payload: {
				msg: "No nearby bus stops through which requested bus passes through"
			}
		});
	} else {
		return callback(err, {
			success: true,
			payload: {
				msg: "Success",
				gps_lat: closest_stop.gps_lat,
				gps_lon: closest_stop.gps_lon,
				stop_name: closest_stop.stop_name,
				time: "06:00"
			}
		});
	}
};

module.exports = BusController;
