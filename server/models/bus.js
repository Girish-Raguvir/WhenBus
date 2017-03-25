var mongoose = require("mongoose");

// To be used during deployment

// mongoose.connect(process.env.PROD_MONGODB, function (error) {
//     if (error) console.error(error);
//     else console.log('mongo connected');
// });

var mongoSchema = mongoose.Schema;
var bus = {
	"bus_no": String,
	"start_stop_id": String,
	"end_stop_id": String,
};

module.exports = mongoose.model('buses', bus);;
