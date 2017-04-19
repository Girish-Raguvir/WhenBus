# WhenBus - CS3410 Course Project

- It’s a real time crowdsourcing app
- Provides buses to desired destination 
- Provides more reliable arrival times
- Provides navigation to nearest relevant bus stop

# Project Website

	http://cs3410-whenbus.herokuapp.com/ (Best when viewed in Google Chrome)
	
How to Deploy :
===============

Run script to load the data into the DBMS:
	
	./load_data.sh

To run server on localhost: (runs, by default, on port 3000)

	cd server && node index.js
	
Alternatively, to deploy via heroku: 
	
	heroku local web
	
To update API Doc/JSDoc use:

	./create_doc.sh

All docs can be found at:

	http://cs3410-whenbus.herokuapp.com/

To  run units test run:
	
	./run_test.sh
