# Control Flow

additional stuff
----------------
* link all maps to google maps app

database modification 
----------------------
* Bus stop dupicates
* DUplicate array for timings(static dynamic)
	

Bus/Stop Query(GET)
-------------------
Input : Start, End location(all from user)

	* find all buses goto that destination.
	* Find nearest stop that has atleast one of those buses
	* Then find all buses via that bus stop with that destination 
	* Then for each bus, look at timing information.
		* Find the time closest and just above the current time.
	* return : bus stop, bus numbers and estimate times
	
More specific details are :
* Find all buses through destination
* Cosider all bus-stops that above buses visit before destination, - Instead try only for nearrby stops
* Find nearest from above stops
* Find set of all buses that go from start to end (start and end are now fixed)

Query time :
	* Closest time just greater from timetable(dynamic)
	
Heuristics(POST) :
------------------
User sends if User crossses velocity threshold :
* In Bus ?(from user)
* Bus No ?(from user)
* Bus Stop ?(from user/app)
* Direction ?(from user)
* his/her location (from app)

Function needed: 
	* Reset function for copying back
	* translate - (user bus + direction) to a database bus. Ex; IITM + forward = IITM-f(in DB)
	
Assume there is only 1 bus in every direction at any point in time

Update is a follows

	* Heuristics requires  Bus stop, Bus Query, Time of Update Query(or update from user)
	* Goto each stop ahead, and do transformation(say linear). 
	* Same logic, look for nearest time just above  current time 
	* requires, current bus stop last stop(from bus no.) and time.  
		
	

