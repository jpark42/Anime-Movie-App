// require Express, Morgan middleware
const express = require('express');
const morgan = require('morgan');
const app = express();

const uuid = require('uuid');

// bodyparser
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

// setup the logger in terminal by using morgan
app.use(morgan('common'));  

// CORS
const cors = require('cors');

app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  origin: '*'
}));
// Add Access Control Allow Origin headers

/* app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*", "https://localhost:1234/");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});*/


/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234/'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
*/

// importing auth.js file, passport module & passport.js
let auth = require('./auth')(app); //auth not being used???
// importing Passport module and passport.js file
const passport = require('passport');
require('./passport');

//Integrating Mongoose with a REST API
const mongoose = require('mongoose');
const { restart } = require('nodemon');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// express validator for server-side validation
const { check, validationResult } = require('express-validator');


// allows Mongoose to connect to AnimeFlixDB for CRUD operations on docs within REST API
mongoose.connect('mongodb://127.0.0.1/AnimeFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

// connects AnimeFlixDB on Atlas to Heroku API
//mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// automatically route request to send back response with a file in the /Public root folder. express.static to serve documentation.html from public folder
app.use(express.static('public')); 

/*
************** CRUD REST API COMMANDS AND ENDPOINT DEFINITIONS ********************
*/


app.get('/', (req, res) => {
  res.send('Sit back, relax, eat snacks. Welcome to AnimeFlix!');
});

// Get list of all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      //Catch-all error-handling function that sends back the message of what error occurred
      res.status(500).send({error: err});
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  //In order to “READ” a user by their username, you need to pass, as a parameter, an object that contains the criteria by which you want to find that user, which, in this case, is their username
  Users.findOne({ Username: req.params.Username })
    //Send a response back to the client with the user data (document) that was just read
    //The parameter for this callback is named “users”, but it could be called anything
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({error: err});
    });
});

// Allow new user to register
/* We’ll expect JSON in this format because that's how it was modeled in Mongoose
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',  
  [
    check('Username', 'Username must have minimum of 5 characters').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  //Hash any password entered by the user when registering before storing it in the MongoDB database
  let hashedPassword = Users.hashPassword(req.body.Password); 
  //check if a user with the username provided by the client already exists and querying the “Users” model using Mongoose
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        //if user already exists, display the following message
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        //f the user doesn’t exist, you use Mongoose’s create command to “CREATE” the new user
        Users
          .create({
            //req.body is the request that the user sends. This collects the info from the HTTP request body, uses Mongoose to populate a user document, then add it to the database
            //Mongoose is translating Node.js code into a MongoDB command that runs behind the scenes to insert a record into your “Users” collection
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          //callback function takes the document you just added as a parameter. Here, this new document is given the name “user”
          //Within this callback, you then send a response back to the client that contains both a status code and the document (called “user”) letting them know their request has been completed
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          //Catch-all error-handling function if any required parameters detailed in the "users" model are not satisfied
          console.error(error);
          res.status(500).send({error: error});
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({error: error});
    });
});

// Allow users to update their user info
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  //updating users with a certain username and using $set to specify which fields in the user document is being updated
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    //displays error or updated user 
    if(err) {
      console.error(err);
      res.status(500).send({error: err});
    } else {
      res.status(200).json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err});
    } else {
      res.status(200).json(updatedUser);
    }
  });
});

// Delete a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send({error: err});
    } else {
      res.status(200).json(updatedUser);
    }
  });
});

//Allow existing users to delete their account
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({error: err});
    });
});


// Get list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      //Catch-all error-handling function that sends back the message of what error occurred
      res.status(500).send({error: err});
    });
});

// Get a movie by movie title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  //In order to “READ” a movie by it's title, you need to pass, as a parameter, an object that contains the criteria by which you want to find that movie, which, in this case, is the title
  Movies.findOne({ Title: req.params.Title })
    //Send a response back to the client with the user data (document) that was just read
    //The parameter for this callback is named “users”, but it could be called anything
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({error: err});
    });
});

// Get genre by name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.genreName})
  .then((movie) => {
    res.status(200).json(movie.Genre);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: + err');
  });
});

// Get a director data by their name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Director.Name': req.params.directorName})
  .then((movie) => {
    res.status(200).json(movie.Director);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: + err');
  });
});

// Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oh oh, something went wrong. Please try again later.");
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
