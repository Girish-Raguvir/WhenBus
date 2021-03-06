/*
 * File to populate DB with dummy bus stops data
 */

var stop_model = require("../models/bus_stop.js")

var mongoose = require("mongoose")
var stps = []


// Clear the collection for bus stops
stop_model.remove({}, function(err) {
	if (!err) {
		console.log("cleared bus stops successfully")
	} else {
		console.log("Error occured when clearing bus stops database")
	}
});

// Populate the Bus Stops collection

// Add each element one by one
stps.push(new stop_model({
	stop_id: "1",
	stop_name: "Jamuna Hostel",
	gps_lat: 12.986616,
	gps_lon: 80.238765
}));

stps.push(new stop_model({
	stop_id: "2",
	stop_name: "Narmada Hostel",
	gps_lat: 12.986492,
	gps_lon: 80.235329
}));

stps.push(new stop_model({
	stop_id: "16",
	stop_name: "Gurunath Bus Stop",
	gps_lat: 12.986556,
	gps_lon: 80.235345
}));

stps.push(new stop_model({
	stop_id: "3",
	stop_name: "Sports Complex",
	gps_lat: 12.986586,
	gps_lon: 80.233226
}));

stps.push(new stop_model({
	stop_id: "17",
	stop_name: "Taramani Guest House",
	gps_lat: 12.986661, 
	gps_lon: 80.233301
}));

stps.push(new stop_model({
	stop_id: "4",
	stop_name: "CRC Back1",
	gps_lat: 12.987765, 
	gps_lon: 80.231222
}));

stps.push(new stop_model({
	stop_id: "18",
	stop_name: "CRC Back2",
	gps_lat: 12.987826, 
	gps_lon: 80.231165
}));

stps.push(new stop_model({
	stop_id: "5",
	stop_name: "BT Department",
	gps_lat: 12.990013,
	gps_lon: 80.227703
}));

stps.push(new stop_model({
	stop_id: "26",
	stop_name: "BT Department 3",
	gps_lat: 12.990166,
	gps_lon: 80.227519
}));

stps.push(new stop_model({
	stop_id: "27",
	stop_name: "BT Department 4",
	gps_lat: 12.990066,
	gps_lon: 80.227719
}));

stps.push(new stop_model({
	stop_id: "6",
	stop_name: "Velachery Gate",
	gps_lat: 12.988455,
	gps_lon: 80.223369
}));

stps.push(new stop_model({
	stop_id: "7",
	stop_name: "BT Department 2",
	gps_lat: 12.990274,
	gps_lon: 80.227574
}));

stps.push(new stop_model({
	stop_id: "19",
	stop_name: "CRC Front1",
	gps_lat: 12.990829,
	gps_lon: 80.230112
}));

stps.push(new stop_model({
	stop_id: "8",
	stop_name: "CRC Front2",
	gps_lat: 12.990837, 
	gps_lon: 80.229999
}));

stps.push(new stop_model({
	stop_id: "9",
	stop_name: "IAR office",
	gps_lat: 12.991052, 
	gps_lon: 80.232114
}));

stps.push(new stop_model({
	stop_id: "20",
	stop_name: "HSB",
	gps_lat: 12.991079,
	gps_lon: 80.232123
}));

stps.push(new stop_model({
	stop_id: "10",
	stop_name: "Gajendra Circle1",
	gps_lat: 12.991790,
	gps_lon: 80.233765
}));

stps.push(new stop_model({
	stop_id: "21",
	stop_name: "Gajendra Circle2",
	gps_lat: 12.991788, 
	gps_lon: 80.233735
}));

stps.push(new stop_model({
	stop_id: "11",
	stop_name: "Post Office1",
	gps_lat: 12.993675,
	gps_lon: 80.234280
}));

stps.push(new stop_model({
	stop_id: "22",
	stop_name: "Post Office2",
	gps_lat: 12.993686,
	gps_lon: 80.234308
}));

stps.push(new stop_model({
	stop_id: "12",
	stop_name: "Children's Park1",
	gps_lat: 12.996115,
	gps_lon: 80.236035
}));

stps.push(new stop_model({
	stop_id: "23",
	stop_name: "Children's Park2",
	gps_lat: 12.996051,
	gps_lon: 80.236006
}));

stps.push(new stop_model({
	stop_id: "13",
	stop_name: "Vana Vani School1",
	gps_lat: 12.998523,
	gps_lon: 80.239108
}));

stps.push(new stop_model({
	stop_id: "24",
	stop_name: "Vana Vani School2",
	gps_lat: 12.998583,
	gps_lon: 80.239199
}));

stps.push(new stop_model({
	stop_id: "14",
	stop_name: "Residences Bus Stop1",
	gps_lat: 13.002568,
	gps_lon: 80.240052
}));

stps.push(new stop_model({
	stop_id: "25",
	stop_name: "Residences Bus Stop2",
	gps_lat: 13.002646,
	gps_lon: 80.240136
}));

stps.push(new stop_model({
	stop_id: "15",
	stop_name: "Main Gate",
	gps_lat: 13.005971,
	gps_lon: 80.242512
}));

// Open connections
var mongoose = require('mongoose')
mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus')

// Add all elements to collection via 'save'
stps.forEach(function(stp) {
	stp.save(function(err, stp) {
		if (err) return console.error(err);
		console.log("Saved bus stop id : " + stp.stop_id + " to db")
	});
});

// Close connection with DB
mongoose.connection.close()
