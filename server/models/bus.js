var mongoose    =   require("mongoose");

mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus')

// To be used during deployment

// mongoose.connect(process.env.PROD_MONGODB, function (error) {
//     if (error) console.error(error);
//     else console.log('mongo connected');
// });

var mongoSchema =   mongoose.Schema;
var bus  = {
    "bus_no" : String,
    "start_stop_id" : String,
    "end_stop_id" : String,
};

module.exports = mongoose.model('buses',bus);;
