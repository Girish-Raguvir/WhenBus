var express = require("express");

var app = express();
var bodyParser = require("body-parser");
var router = express.Router();

var uuid = require('node-uuid');
var crypto = require('crypto');

var account_controller = require("./controllers/account.js")
var BusController = require('./controllers/bus_and_stop.js')
var heuristics_controller = require('./controllers/heuristics.js')

var User = require("./models/user.js")
var Stop_model = require('./models/bus_stop.js');
var Bus_model = require('./models/bus.js');
var Route_model = require('./models/route.js');


var mongoose = require('mongoose')
mongoose.connect('mongodb://girishraguvir:qwerty@ds129030.mlab.com:29030/whenbus')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	"extended": false
}));

router.get("/", function(req, res) {
	res.json({
		"error": false,
		"message": "Welcome to WhenBus!"
	});
});

router.route("/users/register")
	.post(function(req, res) {

		var response = {};

		var email = req.body.email;
		var name = req.body.name;
		var password = req.body.password;
		var password_salt = uuid.v4();

		var account = new account_controller(User, {});

		account.hashPassword(password, password_salt, function(err, password_hash) {

			if (err) {
				response = {
					"success": false,
					"message": "Error adding data"
				};
				res.json(response);
			} else {
				var new_user = new User();
				new_user.email = email;
				new_user.name = name;
				new_user.password_salt = password_salt;
				new_user.password_hash = password_hash;

				account.register(new_user, function(err, resp) {
					if (err) {
						response = {
							"success": false,
							"message": "Error registering"
						};
					} else {
						response = {
							"success": resp.success,
							"message": resp.payload
						};
					}
					res.json(response);
				});
			}
		});
	});

router.route("/users/login")
	.post(function(req, res) {

		var response = {};

		var email = req.body.email;
		var password = req.body.password;

		var account = new account_controller(User, {});

		account.login(email, password, function(err, resp) {
			if (err) {
				response = {
					"success": false,
					"message": "Error logging in"
				};
			} else {
				response = {
					"success": resp.success,
					"message": resp.payload
				};
			}
			res.json(response);
		});
	});

router.route("/bus")
	.post(function(req, res) {
		var response = {};

		var lat_u = req.body.gps_lat_u;
		var lon_u = req.body.gps_lon_u;
		var lat_d = req.body.gps_lat_d;
		var lon_d = req.body.gps_lon_d;
		var bus_no = req.body.bus_no;

		// Locate BusStop
		var bus = new BusController(lat_u, lon_u, lat_d, lon_d, Stop_model, Bus_model, Route_model);

		bus.findStop(function(err, resp) {
			if (err) {
				response = {
					"success": false,
					"message": "Error fetching data"
				};
			} else {
				response = {
					"success": resp.success,
					"message": resp.payload
				};
			}
			res.json(response);
		});
	});

router.route("/heuristics")
	.post(function(req, res) {
		var response = {};

		var choice = req.body.choice;
		var lon = req.body.gps_lon;
		var lat = req.body.gps_lat;
		var bus_no = req.body.bus_no;
		var bus_stop = req.body.bus_stop;
		var direction = req.body.direction;

		var heuristics = new heuristics_controller(lat, lon, bus_no, bus_stop, direction, Route_model, Stop_model);

		if (choice == "update") {
			heuristics.update(function(err, resp) {
				if (err) {
					response = {
						"success": false,
						"message": "Error"
					};
				} else {
					response = {
						"success": resp.success,
						"message": resp.payload
					};
				}
				res.json(response);
			});
		} else if (choice == "query") {
			heuristics.query(function(err, resp) {
				if (err) {
					response = {
						"success": false,
						"message": "Error"
					};
				} else {
					response = {
						"success": resp.success,
						"message": resp.payload
					};
				}
				res.json(response);
			});
		}

	});

app.use('/', router);

// app.listen(process.env.PORT || 3000);
app.listen(3000);
console.log("Listening");
