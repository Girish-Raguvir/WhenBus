var mongoose    =   require("mongoose");

mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus');

var mongoSchema =   mongoose.Schema;
var user_schema  = {
    "email" : String,
    "password" : String
};

module.exports = mongoose.model('user_login',user_schema);;
