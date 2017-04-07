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

/**
 * @api {get} / Home
 * @apiName TestWelcome
 * @apiGroup User
 * @apiDescription Test endpoint that displays sample message for testing
 *
 * @apiSuccess {String} message Returns a welcome message on success
 * @apiSuccess {Boolean} error Success/Failure Status 
 */
router.get("/", function(req, res) {
	res.json({
		"error": false,
		"message": "Welcome to WhenBus!"
	});
});

/**
 * @api {post} /users/register Register
 * @apiName Register
 * @apiGroup User
 *
 * @apiParam {String} email Unique user email ID
 * @apiParam {String} name User screen name
 * @apiParam {String} password User password(encrypted)
 *
 * @apiParamExample {json} Request-Example:
 *{ "email" : "sample@iitm.ac.in", "password" : "simple", "name":"John Doe"}
 *
 * @apiDescription Endpoint for registering previously non-existent users. Ensures that user is not already registered and accordingly create a new entry in the database
 * @apiSuccess {Boolean} success Success/Failure Status
 * @apiSuccess {String} message Error message
 * @apiSuccess {Object} payload Payload Present if succesful registration
 * @apiSuccess {String} payload.msg Error code if failure/invalid parameters
 * @apiSuccess {String} payload.user_profile Unique user profile
 */
router.route("/users/register")
	.post(function(req, res) {

		var response = {};

		// Get details from body
		var email = req.body.email;
		var name = req.body.name;
		var password = req.body.password;
		var password_salt = uuid.v4();

		var account = new account_controller(User, {});

		// Encrypt password
		account.hashPassword(password, password_salt, function(err, password_hash) {

			if (err) {
				response = {
					"success": false,
					"message": "Error adding data"
				};
				res.json(response);
			} else {
				// Create new user
				var new_user = new User();
				new_user.email = email;
				new_user.name = name;
				new_user.password_salt = password_salt;
				new_user.password_hash = password_hash;

				// Register the user, add to DB
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

/**
 * @api {post} /users/login Login
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} email Unique user email ID
 * @apiParam {String} password User password(encrypted)
 *
 * @apiParamExample {json} Request-Example:
 *{ "email" : "sample@iitm.ac.in", "password" : "simple"}
 *
 * @apiDescription Endpoint for user log-in. Returns a unique token or a error message based on successful/failed login attempt. 
 * @apiSuccess {Boolean} success Success/Failure Status
 * @apiSuccess {String} message Error message
 * @apiSuccess {Object} payload Payload Present if succesful registration
 * @apiSuccess {String} payload.msg Error code if failure/invalid parameters
 * @apiSuccess {String} payload.user_profile Unique user profile for keeping track of user session
 */
router.route("/users/login")
	.post(function(req, res) {

		var response = {};

		// Get user input details
		var email = req.body.email;
		var password = req.body.password;

		var account = new account_controller(User, {});

		// Attempt Login
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

/**
 * @api {post} /bus Bus Query
 * @apiName Bus
 * @apiGroup Query
 *
 * @apiParam {String} gps_lat_u Current user latitude
 * @apiParam {String} gps_lon_u Current user longitude
 * @apiParam {String} gps_lat_d User destination latitude
 * @apiParam {String} gps_lon_d User destination longitude
 *
 * @apiParamExample {json} Request-Example:
 * { "gps_lat_u" : 12.989091, "gps_lon_u" : 80.230755, "gps_lat_d" : 12.989091, "gps_lon_d" : 80.230755 }
 * @apiDescription For a given user destination and location, the query finds the best bus stop and list of buses along with expected arrival time for the each of buses.
 * @apiSuccess {Boolean} success Success/Failure Status
 * @apiSuccess {String} message Error message
 * @apiSuccess {Object} payload Payload Present if succesful registration
 * @apiSuccess {Number} payload.stop_lat Latitude of best bus stop for User
 * @apiSuccess {Number} payload.stop_lat Longiture of best bus stop for User
 * @apiSuccess {Object[]} payload.bus_details The buses and associate arrival times
 * @apiSuccess {String} payload.bus_details.bus_no Bus No. that user can board
 * @apiSuccess {String} payload.bus_details.arrival_time The expected arrival time of the corresponding bus
 * @apiSuccess {String} payload.msg Error code if failure/invalid parameters
 */
router.route("/bus")
	.post(function(req, res) {
		var response = {};

		var lat_u = req.body.gps_lat_u;
		var lon_u = req.body.gps_lon_u;
		var lat_d = req.body.gps_lat_d;
		var lon_d = req.body.gps_lon_d;
		var bus_no = req.body.bus_no;

		// Create class object
		var bus = new BusController(lat_u, lon_u, lat_d, lon_d, Stop_model, Bus_model, Route_model);

		// Get buses/timings and  one bus stop
		bus.findBus(function(err, resp) {
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

/**
 * @api {post} /heuristics Crowdsourcing
 * @apiName Heuristics
 * @apiGroup Update
 *
 * @apiParam {String} gps_lat Current user latitude
 * @apiParam {String} gps_lon Current user longitude
 * @apiParam {String} bus_no Bus number that user is travelling on
 * @apiParam {String} bus_stop Estimated bus stop where user embarked bus
 *
 * @apiParamExample {json} Request-Example:
 *{ "gps_lon" : 80.233645, "gps_lat" : 12.935164, "bus_no" : "IITM1_f", "bus_stop" : "2" }
 * @apiDescription The query updates the database with the given latitude longitude and time stamp for the appropriate bus. Performs heuristics to estimate arrival times.
 * @apiSuccess {Boolean} success Success/Failure Status
 * @apiSuccess {String} message Error message
 * @apiSuccess {Object} payload Present if succesful registration
 * @apiSuccess {String} payload.msg Error code if failure/invalid parameters
 */
router.route("/heuristics")
	.post(function(req, res) {
		var response = {};

		// Get user input from crowdsourcing
		var lon = req.body.gps_lon;
		var lat = req.body.gps_lat;
		var bus_no = req.body.bus_no;
		var bus_stop = req.body.bus_stop;

		var heuristics = new heuristics_controller(lat, lon, bus_no, bus_stop, direction, Route_model, Stop_model);

		// Perform update using collected data
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

	});

app.use('/', router);

app.listen(process.env.PORT || 3000);
console.log("Listening");
