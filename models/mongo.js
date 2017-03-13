var mongoose    =   require("mongoose");

var mongoSchema =   mongoose.Schema;
var user_schema  = {
    "email" : String,
    "password" : String
};
module.exports = mongoose.model('user_login',user_schema);;
