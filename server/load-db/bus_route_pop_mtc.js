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
			for(h=6; h<=21; h++){
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
			for(h=6; h<=21; h++){
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

temp_stp1 = [0, 15, 25, 24, 23, 22, 21, 20, 19, 26, 6, 27, 18, 17, 16, 1 ]
for (i = 1; i <= 15; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp1[y];}(i)),
		bus_no: "IITM1_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=6; h<=21; h++){
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

temp_stp2 = [0, 6, 27, 18, 17, 16, 1 ]
for (i = 1; i <= 6; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp2[y];}(i)),
		bus_no: "IITM2_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(h=6; h<=21; h++){
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

// MTC
// 5E & 47A
temp_stp3 = [26, 27, 28, 29, 30, 31, 32, 33, 34]

temp_stp4 = [34, 33, 35, 43, 36, 37, 38, 39, 42]
temp_stp6 = [34, 33, 35, 43, 36, 37, 38, 39, 40]


for (i = 1; i <= 9; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp3[y];}(i)),
		bus_no: "5E_f",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(tim=60*60*5 + 2*(i-1)*60; tim<=60*60*18 + 60*30; tim=tim + 60*40 ){
				times.push(tim);
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 9; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp3[y];}(i)),
		bus_no: "47A_f",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(tim=55*60 + 60*60*7 + 2*(i-1)*60; tim<=60*60*20 ; tim=tim + 60*60 ){
				times.push(tim);
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 9; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp3[y];}(i)),
		bus_no: "599_f",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(tim=60*30 + 60*60*4 + 2*(i-1)*60; tim<=60*60*19 + 60*30; tim=tim + 60*40 ){
				times.push(tim);
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 9; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp4[y];}(i)),
		bus_no: "5E_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(tim=60*5 + 60*60*5 + 2*(i-1)*60; tim<=60*60*18 + 60*30; tim=tim + 60*40 ){
				times.push(tim);
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 9; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp4[y];}(i)),
		bus_no: "47A_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(tim=60*60*8 + 2*(i-1)*60; tim<=60*60*20 ; tim=tim + 60*60 ){
				times.push(tim);
			}
			return times;
		}()
	}));
}

for (i = 1; i <= 9; i++) {
	routes.push(new route_model({
		bus_stop: String(function iden(y){ return temp_stp6[y];}(i)),
		bus_no: "599_b",
		stop_no: i,
		timings: function get_timings() {
			times = []
			for(tim=40*60 + 60*60*4 + 2*(i-1)*60; tim<=60*60*19 + 60*30; tim=tim + 60*40 ){
				times.push(tim);
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
