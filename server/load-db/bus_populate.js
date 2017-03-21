/*
 * File to populate DB with dummy bus data
 */

var bus_model = require("../models/bus.js")
var mongoose = require("mongoose")
var buses = []

// Clear the collection for bus stops
bus_model.remove({}, function(err) {
	if (!err) {
		console.log("cleared buses successfully")
	} else {
		console.log("Error occured when clearing buses database")
	}
});

// Populate the Bus Stops collection

// Add each element one by one
buses.push(new bus_model({
	bus_no: "IITM1",
	start_stop_id: "1",
	end_stop_id: "15",
}));

buses.push(new bus_model({
	bus_no: "IITM2",
	start_stop_id: "1",
	end_stop_id: "6",
}));

buses.push(new bus_model({
	bus_no: "IITM3",
	start_stop_id: "15",
	end_stop_id: "1",
}));

buses.push(new bus_model({
	bus_no: "IITM4",
	start_stop_id: "6",
	end_stop_id: "1",
}));

// Add all elements to collection via 'save'
buses.forEach(function(bus_element) {
	bus_element.save(function(err, bus_element) {
		if (err) return console.error(err);
		console.log("Saved bus id : " + bus_element.bus_no + " to db")
	});
});

// Close connection with DB
mongoose.connection.close()
