/*
 * File to populate DB with dummy routes data
 */

var route_model = require("../models/route.js")
var mongoose = require("mongoose")
var i
var routes = []

// Clear the collection for bus stops
route_model.remove({}, function(err) {
	if (!err) {
		console.log("cleared routes successfully")
	} else {
		console.log("Error occured when clearing routes database")
	}
});

function format_string(x){
	if(x<10)
		return "0"+String(x)
	else
		return x;
}

// Populate the Bus Stops collection

// Add each element one by one
for (i = 1; i <= 15; i++) {
	routes.push(new route_model({
		bus_stop: String(i),
		bus_no: "IITM1",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=0; m<60; m=m+15){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
                    times.push(format_string(cur_h) + ":" + format_string(cur_m));
				}
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 6; i++) {
	routes.push(new route_model({
		bus_stop: String(i),
		bus_no: "IITM2",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=0; m<60; m=m+30){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
                    times.push(format_string(cur_h) + ":" + format_string(cur_m));
				}
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 15; i++) {
	routes.push(new route_model({
		bus_stop: String(i),
		bus_no: "IITM3",
		stop_no: 16 - i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=0; m<60; m=m+15){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
                    times.push(format_string(cur_h) + ":" + format_string(cur_m));
				}
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 6; i++) {
	routes.push(new route_model({
		bus_stop: String(i),
		bus_no: "IITM4",
		stop_no: 7 - i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=15; m<60; m=m+30){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
                    times.push(format_string(cur_h) + ":" + format_string(cur_m));
				}
			}
			return times;
		}()
	}));
}

// Add all elements to collection via 'save'
routes.forEach(function(route_element) {
	route_element.save(function(err, route_element) {
		if (err) return console.error(err);
		console.log("Saved (bus no, stop no) : (" + route_element.bus_no + ", " + route_element.stop_no + ") to db")
	});
});

// Close connection with DB
mongoose.connection.close()
