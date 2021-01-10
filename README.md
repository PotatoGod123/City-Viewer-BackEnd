# Back End Lab, City Viewer Lab-06-09

## Overview
This project will be using a pre built front end website to test out the functionality of the back-end side I am making. Using node and heroku to deploy and have a working server, the problem at hand is giving the front end part of the website information when calling the back end via ajax.



**Version**: 1.4.0

# Contribution

 As always thank you MDN!

## Author: Cristian Robles/Code Fellows

### Comments

- Took a bit to figure out the problem but once I have solved it went as a breeze

## Getting Started

### Number and name of feature:

1. Repository Set Up

Estimate of time needed to complete: 30min

Start time: 8:00pm

Finish time: 8:16pm

Actual time needed to complete: 15min  


Number and name of feature:  
2. Set up Server with requestin data from weather and location endpoints and having a response depending on invalid user input.

Estimate of time needed to complete: 3 Hours

Start time: 8:20pm

Finish time: 10:30pm

Actual time needed to complete: 1 Hour 30mins  


3. Refactored code to request data from an api and send that back as a response instead of using pre set json files.

Estimate of time needed to complete: 3 Hours

Start time: 09:00pm

Finish time: 10:40pm

Actual time needed to complete: 1 Hour 40mins

4. Made a databased and refactored code to use database information in conjuction of api's.

Estimate of time needed to complete: 3 Hours

Start Time: 09:30pm

Finish Time: 01:20am

Actual time neeeded to comeplete: 2 Hours 30mins

5. Added yelp and movies API into server, when called by routes they will send requested data back to the front end.

Estimate of time needed to complete: 3 Hours

Start Time: 05:30pm

Finish Time: 06:50pm

Actual time neeeded to comeplete: 1 Hours 30mins



## Architecture
Using Javascript with Node.js and it's libraries and a couple of dependecies(dotenv,express,cors,superagent) while having a database as well using postgres.  

### WRRC 
This is an image of WRRC for lab07
![My WRRC drawned](./img/WRRC-lab07.png)  

This image is the WRRC but with a database added now
![WRRC with Database](./img/WRRC-lab08.png)  


## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples: !-->

01-09-2021 7:30pm Ver 1.4.0 - Added code into server.js with routes to movies and yelp with function handlders and constructors for each to tailor data and then send back to the front end as json information with response. Also changed database column name to keep same throught data crossing.

01-07-2021 1:20am Ver 1.3.0 - Changed server code to use a database now, refactored code to only call API is information is not the database already, And if it is, it will use the date from there. Added schema.sql file as well.

12-30-2020 10:40pm Ver 1.2.0  - Changed API to request from other APIs and use the promise data to convert and send back as a response to the front end request

12-23-2020 12:05am Ver: 1.1.1 - Fixed bug happening with flag trigger staying to true so if statement wouldn't allow proper response to be sent

12-23-2020 11:45pm Ver: 1.1.0- Application now has a fully-functional express server, with a GET route for the location resource. When couple of fall backs as to when not desirable inputs happen.  

