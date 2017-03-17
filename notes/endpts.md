# Different Enpoints for backend

Register:
---------
* Recv : email/password
* Return : success, failed, user already exists

Login:
-----
* Recv : username, password
* Return : user token for transactions

Logout :
--------
* Recv : Logout, user token
* Return : Sucess/Failure

BusStop :
---------
* Recv :
	* GPS Co-ord, userToken (Frontend gives cur gps or gps of another location)
	* Map location, userToken(backend converts to GPS)(alternately)
* Return : GPS,name of nearest bus stop(s)

BusQuery :
-----------
* Recv : Query Type(bus no query,  GPS query, userToken )
	* Bus no., direction(final dest.), time?
	* Start GPS and End GPS coords, time?(alternately)
* Return :
	* tuples of (BusNo.,arrival time) or (BusNo., location) via specified start, end
	* If no bus there indicate the same

Update :
--------
* Recv : Bus No., Direction, Timestamp, Cur user GPS, userToken
* Return : Sucess, Update Mongo

Other(extra):
------------
* User Profile?
* User Trips
