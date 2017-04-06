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

The requests(GET/POST) are :
* POST - /users/register
* POST - /users/login
* POST - /bus
* GET - /

Run APIDOC/JSDoc Using :

	./create_doc.sh


APIDOC found at:

	http://whenbus-api-doc.s3-website.ap-south-1.amazonaws.com/
