# WhenBus - CS3400 Course Project

- It’s a real time crowdsourcing app
- Provides more reliable arrival time
- Can track buses
- Navigate through bus routes

How to Deploy :
===============

Run script to load the data into the DBMS:
	
	./load_data.sh

Then deploy via heroku(runs on port 5000 for below command)
	
	heroku local web
	#Alternately
	# cd server && node index.js
	  

Run APIDOC/JSDoc Using :

	./create_doc.sh

APIDOC found at:

	https://cs3410-whenbus.herokuapp.com/api
	https://cs3410-whenbus.herokuapp.com/docs

To  run units test run
	
	./run_test.sh
