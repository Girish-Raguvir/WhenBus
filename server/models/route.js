var mongoose = require("mongoose");

// To be used during deployment

// mongoose.connect(process.env.PROD_MONGODB, function (error) {
//     if (error) console.error(error);
//     else console.log('mongo connected');
// });

var mongoSchema = mongoose.Schema;
var route = {
	"bus_stop": String,
	"bus_no": String,
	"stop_no": Number,
	"timings": Array
};

module.exports = mongoose.model('routes', route);;
