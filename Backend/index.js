var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoOp     =   require("./models/mongo");
var router      =   express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Welcome to WhenBus!"});
});

router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .post(function(req,res){
        var db = new mongoOp();
        var response = {};
        db.email = req.body.email;
        db.password = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
        db.save(function(err){
            if(err) {
                response = {"error" : true, "message" : "Error adding data"};
            } else {
                response = {"error" : false, "message" : "User successfully added to database"};
            }
            res.json(response);
        });
    });


app.use('/',router);

app.listen(process.env.PORT || 3000);
