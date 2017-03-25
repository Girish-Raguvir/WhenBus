var mongoose = require("mongoose");

// To be used during deployment

// mongoose.connect(process.env.PROD_MONGODB, function (error) {
//     if (error) console.error(error);
//     else console.log('mongo connected');
// });

var mongoSchema = mongoose.Schema;
var bus_stop = {
	"stop_id": String,
	"stop_name": String,
	"gps_lat": Number,
	"gps_lon": Number
};

module.exports = mongoose.model('bus_stops', bus_stop);;
