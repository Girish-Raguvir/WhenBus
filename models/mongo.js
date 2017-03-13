var mongoose    =   require("mongoose");

mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus')

// To be used during deployment

// mongoose.connect(process.env.PROD_MONGODB, function (error) {
//     if (error) console.error(error);
//     else console.log('mongo connected');
// });

var mongoSchema =   mongoose.Schema;
var user_schema  = {
    "email" : String,
    "password" : String
};

module.exports = mongoose.model('user_login',user_schema);;
