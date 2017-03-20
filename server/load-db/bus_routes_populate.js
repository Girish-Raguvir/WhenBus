var route_model = require("../models/route.js")
var mongoose = require("mongoose")

// Clear the collection for bus stops
route_model.remove({ }, function(err) {
    if (!err) {
		console.log("cleared routes successfully")
    }
    else {
		console.log("Error occured when clearing routes database")
    }
});

// Populate the Bus Stops collection
routes = []

var i
for(i=1; i<=15; i++){
	routes.push(new route_model ({
		bus_stop : String(i),
		bus_no : "IITM1",
		stop_no : i
	}));
}

for(i=1; i<=6; i++){
	routes.push(new route_model ({
		bus_stop : String(i),
		bus_no : "IITM2",
		stop_no : i
	}));
}

for(i=1; i<=15; i++){
	routes.push(new route_model ({
		bus_stop : String(i),
		bus_no : "IITM3",
		stop_no : 16-i
	}));
}

for(i=1; i<=6; i++){
	routes.push(new route_model ({
		bus_stop : String(i),
		bus_no : "IITM4",
		stop_no : 7 -i
	}));
}

routes.forEach(function(route_element){
	route_element.save(function (err, route_element) {
	  if (err) return console.error(err);
		console.log("Saved (bus no, stop no) : (" +  route_element.bus_no + ", " + route_element.stop_no +  ") to db")
	});
});

mongoose.connection.close()
