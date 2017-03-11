var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/whenbus');
var mongoSchema =   mongoose.Schema;
var user_schema  = {
    "email" : String,
    "password" : String
};
module.exports = mongoose.model('user_login',user_schema);;
