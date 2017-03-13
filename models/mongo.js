var mongoose    =   require("mongoose");

mongoose.connect(process.env.PROD_MONGODB, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var mongoSchema =   mongoose.Schema;
var user_schema  = {
    "email" : String,
    "password" : String
};
module.exports = mongoose.model('user_login',user_schema);;
