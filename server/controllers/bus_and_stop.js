var BusController = function(lat, lon, bus_no) {
	this.lat = lat;
	this.lat = lat;
	this.bus_no = str.toLowerCase(bus_no);
	this.stop_model = require('../models/bus_stop.js');
	this.bus_model = require('../models/bus.js');
	this.busExists = 0;
};

BusController.prototype.getDistanceFromLatLonInKm = function(lat1,lon1) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(this.lat-lat1);  // deg2rad below
  var dLon = deg2rad(this.lon-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(this.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

BusController.prototype.deg2rad = function(deg) {
  return deg * (Math.PI/180)
}

Account.prototype.findStop = function(callback) {

	// Check if bus exists in database
	this.bus_model.findOne({ bus_no this.bus_no }, function(err, bus) {
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

	// Find the nearest bus
	
};


module.exports = BusController;
