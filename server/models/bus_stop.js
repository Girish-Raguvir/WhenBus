var mongoose    =   require("mongoose");

mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus')

// To be used during deployment

// mongoose.connect(process.env.PROD_MONGODB, function (error) {
//     if (error) console.error(error);
//     else console.log('mongo connected');
// });

var mongoSchema =   mongoose.Schema;
var bus_stop  = {
    "stop_id" : String,
    "stop_name" : String,
    "gps_x" : Number,
    "gps_y" : Number
};

module.exports = mongoose.model('bus_stops',bus_stop);;
