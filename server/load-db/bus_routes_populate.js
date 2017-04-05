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
temp_stp = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
for (i = 1; i <= 15; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp[y];}(i)),
		bus_no: "IITM1_f",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=0; m<60; m=m+15){
					var cur_h = h+ Math.floor((m+i)/60);
					var cur_m = (m+i)%60;
					var tot_time = cur_h * 60 * 60  + cur_m * 60 ;
					times.push(tot_time);
				}
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 6; i++) {
	routes.push(new route_model({
		bus_stop: String(i),
		bus_no: "IITM2_f",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=0; m<60; m=m+30){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
					var tot_time = cur_h * 60 * 60   + cur_m * 60 ;
					times.push(tot_time);
				}
			}
			return times;
		}()
	}));
}

temp_stp1 = [15, 25, 24, 23, 22, 21, 20, 19, 26, 6, 27, 18, 17, 16, 1 ]
for (i = 1; i <= 15; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp1[y];}(i)),
		bus_no: "IITM1_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=0; m<60; m=m+15){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
					var tot_time = cur_h * 60 * 60  + cur_m * 60 ;
					times.push(tot_time);
				}
			}
			return times;
		}()
	}));
}

temp_stp2 = [6, 27, 18, 17, 16, 1 ]
for (i = 1; i <= 6; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp2[y];}(i)),
		bus_no: "IITM2_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=15; h<=20; h++){
				for(m=15; m<60; m=m+30){
					var cur_h = h+ Math.floor((m+i)/60)
					var cur_m = (m+i)%60
					var tot_time = cur_h * 60 * 60  + cur_m * 60 ;
					times.push(tot_time);
				}
			}
			return times;
		}()
	}));
}

// Open connections
var mongoose = require('mongoose')
mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus')

// Add all elements to collection via 'save'
routes.forEach(function(route_element) {
	route_element.save(function(err, route_element) {
		if (err) return console.error(err);
		console.log("Saved (bus no, stop no) : (" + route_element.bus_no + ", " + route_element.stop_no + ") to db")
	});
});

// Close connection with DB
mongoose.connection.close()
