This is an express.js based backend application for the grievance redressal application.
We have used MongoDB for our cloud storage solution and Passport Library for providing the necessary authentication functionalities.

The folder structure of the application is as follows:

![Alt text](./folder_structure.png?raw=true "Folder Structure")

1. In the config folder, we have authenticate.js file that defines our middlewares ensureAuthenticated( to ensure authentication as and when required) and isAdmin( to ensure that the requesting user is an admin for accessing admin pages).

2. In the models folder, we have defined the schema for the various collections in our database. We have Issues(for the posted grievances), Accepted(for the accepted grievances), Done (for the addressed grievances) and User(for the admins of various departments).

3. In the passport folder, we have setup.js file that defines our authentication strategies as provided by the Passport library. 

4. In the routes folder, we have defined the various APIs to be exposed for integrating with the frontend application.

5. Finally, in the index.js file, we intialize the connection to the mongoDB cluster and then initialize the the authentication strategies as we defined in our setup.js file. We then define the routes and connect them to our app.

______________________________________________________________________________________________________

This project in its basic form tends to act as the first step to a more comprehensive backend application with more powerful functionalities. We will make this project open source for the students of our college, Jorhat Engineering College to collaborate and contribute collectively to take this project further and make it more complete.

Cheers !
