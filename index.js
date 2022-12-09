const express = require('express'),
  app = express();
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));



//Integrating Mongoose with a REST API
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/AnimeFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});


/* users from relational database
let users = [
  {
    id: 1,
    Username: "jpark427",
    Email: "johnnypark@gmail.com",
    Password: "basketball123",
    birthDate: 1996-11-27,
    favoriteMovies: [],

  },

  {
    id: 2,
    Username: "zekeyeducation",
    Email: "zekethefreak@gmail.com",
    Password: "freakyzeke123",
    birthDate: 1998-09-06,
    favoriteMovies: [],
  },

  {
    id: 3,
    Username: "winscomrider",
    Email: "alibinorider@gmail.com",
    Password: "albino123",
    birthDate: 1997-03-15,
    favoriteMovies: [],
  },

  {
    id: 4,
    Username: "bodegamanager",
    Email: "bodegamanager@gmail.com",
    Password: "bodegacat123",
    birthDate: 1994-02-11,
    favoriteMovies: [],
  },

  {
    id: 5,
    Username: "sniperyuta",
    Email: "yutawatanabe@gmail.com",
    Password: "brookyln123",
    birthDate: 1997-05-15,
    favoriteMovies: [],
  }
]
*/

/* movies from relational database
let movies = [
  {
    "Title": "Your Name",
    "Description": "High-schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki's body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.",
    "Date": 2016,
    "Genre": {
      "Name": "Romance",
      "Description": "Romance drama typically refers to a fictional story that focuses on the romantic relationship of two characters."
    },
    "Director": {
      "Name": "Makoto Shinkai",
      "Bio": "Shinkai is a Japanese film maker and animator who is known for incorporating stunning life-like scenes with his mastery in environmental lighting",
      "Birth": 1973,
    },
    "ImageURL": "your_name.jpg",
    "Featured": true,
  },

  {
    "Title": "Spirited Away",
    "Description": "The movie tells the story of Chihiro, a young girl on a mission to rescue her family from the evil witch Yubaba, who turned them into pigs.",
    "Date": 2001,
    "Genre": {
      "Name": "Adventure",
      "Description": "A story where the protagonist goes on an epic journey and faces obstacles in the way of their mission. These films also gives the viewer a feeling of excitement!"
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "Miyazaki is a Japanese animator and director who is also a co-founder of Studio Ghibli. He is internationally known for his exceptional story-telling in his works.",
      "Birth": 1941,
    },
    "ImageURL": "spirited_away.jpg",
    "Featured": true,
  },

  {
    "Title": "A Silent Voice",
    "Description": "This follows a moving story of Shoya Ishida, a school bully, and Shoko Nishimiya, a young girl with a hearing disability. Their story begins in sixth grade when Shoko transfers to Shoya's elementary school and quickly finds herself bullied and isolated due to her hearing disability.",
    "Date": 2017,
    "Genre": {
      "Name": "Romance",
      "Description": "Romance drama typically refers to a fictional story that focuses on the romantic relationship of two characters."
    },
    "Director": {
      "Name": "Naoko Yamada",
      "Bio": "Yamada is a Japanese animator/director who is known for her time at Kyoto Animation where she directed anime series K-On!",
      "Birth": 1984,
    },
    "ImageURL": "a_silent_voice.jpg",
    "Featured": true,
  },

  {
    "Title": "Howl's Moving Castle",
    "Description": "This is a story about the infamous wizard Howl, and a cursed hatmaker named Sophie. Sophie Hatter is a pretty average girl whose been left to maintain her family's hat shop. However, she gets cursed one day by the Witch of the Waste and is turned into an old woman.",
    "Date": 2005,
    "Genre": {
      "Name": "Adventure",
      "Description": "A story where the protagonist goes on an epic journey and faces obstacles in the way of their mission. These films also gives the viewer a feeling of excitement!"
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "Miyazaki is a Japanese animator and director who is also a co-founder of Studio Ghibli. He is internationally known for his exceptional story-telling in his works.",
      "Birth": 1941,
    },
    "ImageURL": "howls_moving_castle.jpg",
    "Featured": true,
  },

  {
    "Title": "Flavors of Youth",
    "Description": "Featuring 3 stories in 3 different Chinese cities, this anime is a sensitively handled triptych exploring the bittersweet understanding adulthood necessitates when confronting the fragility of childhood affections.",
    "Date": 2018,
    "Genre": {
      "Name": "Romance",
      "Description": "Romance drama typically refers to a fictional story that focuses on the romantic relationship of two characters."
    },
    "Director": {
      "Name": "Yoshitaka Takeuchi",
      "Bio": "Takeuchi is a Japanese animator and director who is known for his work in visual effects.",
      "Birth": 1985,
    },
    "ImageURL": "flavors_of_youth.jpg",
    "Featured": false,
  },

  {
    "Title": "Weathering With You",
    "Description": "It depicts a high school boy who runs away from his rural home to Tokyo and befriends an orphan girl who has the ability to control the weather.",
    "Date": 2019,
    "Genre": {
      "Name": "Romance",
      "Description": "Romance drama typically refers to a fictional story that focuses on the romantic relationship of two characters."
    },
    "Director": {
      "Name": "Makoto Shinkai",
      "Bio": "Shinkai is a Japanese film maker and animator who is known for incorporating stunning life-like scenes with his mastery in environmental lighting",
      "Birth": 1973,
    },
    "ImageURL": "weathering_with_you.jpg",
    "Featured": true,
  },

  {
    "Title": "Ponyo",
    "Description": "The daughter of a masterful wizard and a sea goddess, Ponyo uses her father's magic to transform herself into a young girl and quickly falls in love with Sosuke, but the use of such powerful sorcery causes a dangerous imbalance in the world.",
    "Date": 2008,
    "Genre": {
      "Name": "Adventure",
      "Description": "A story where the protagonist goes on an epic journey and faces obstacles in the way of their mission. These films also gives the viewer a feeling of excitement!"
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "Miyazaki is a Japanese animator and director who is also a co-founder of Studio Ghibli. He is internationally known for his exceptional story-telling in his works.",
      "Birth": 1941,
    },
    "ImageURL": "ponyo.jpg",
    "Featured": true,
  },

  {
    "Title": "Kiki's Delivery Service",
    "Description": "A young witch, on her mandatory year of independent life, finds fitting into a new community difficult while she supports herself by running an air courier service. This is the story of a young witch, named Kiki who is now 13 years old.",
    "Date": 1990,
    "Genre": {
      "Name": "Adventure",
      "Description": "A story where the protagonist goes on an epic journey and faces obstacles in the way of their mission. These films also gives the viewer a feeling of excitement!",
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "Miyazaki is a Japanese animator and director who is also a co-founder of Studio Ghibli. He is internationally known for his exceptional story-telling in his works.",
      "Birth": 1941,
    },
    "ImageURL": "kiki_delivery_service.jpg",
    "Featured": true,
  },

  {
    "Title": "Perfect Blue",
    "Description": "Perfect Blue is the story of a retired pop singer-turned-actress, Mima, as her sense of reality starts to shake as she is stalked by an obsessed fan while being haunted from reflections of her past.",
    "Date": 1997,
    "Genre": {
      "Name": "Thriller",
      "Description": "Thrillers have the tendency to keep it's viewers on their toes. These films often elicit feelings of suspense, excitement, and anxiety."
    },
    "Director": {
      "Name": "Satoshi Kon",
      "Bio": "Satoshi Kon is a Japense film maker and animator who was born in Sapporo, Hokkaido and is a member of the Japaense Animation Creators Association.",
      "Birth": 1963,
    },
    "ImageURL": "perfect_blue.jpg",
    "Featured": true,
  },

  {
    "Title": "Akira",
    "Description": "The film depicts a dystopian version of Tokyo in the year 2019, with cyberpunk tones.",
    "Date": 1988,
    "Genre": {
      "Name": "Sci-fi",
      "Description": "This fictionaly genre typically deals with futuristic concepts such as advanced science/technology, space exploration, and time travel."
    },
    "Director": {
      "Name": "Katsuhiro Otomo",
      "Bio": "Otomo is a Japanese film maker and animator who is most known for his film Akira in 1988.",
      "Birth": 1954,
    },
    "ImageURL": "akira.jpg",
    "Featured": true,
  },
]
*/

app.use(express.static('public')); //Automatically route request to send back response with a file in the /Public root folder
// setup the logger in terminal
app.use(morgan('common'));


//GET Requests
app.get('/', (req, res) => {
  res.send('Welcome to AnimeFlix!');
});

//CREATE
app.put('/users/:id', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
});

//Add a user
/* We’ll expect JSON in this format because that's how it was modeled in Mongoose
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  //check if a user with the username provided by the client already exists and querying the “Users” model using Mongoose
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        //if user already exists, display the following message
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        //f the user doesn’t exist, you use Mongoose’s create command to “CREATE” the new user
        Users
          .create({
            //req.body is the request that the user sends. This collects the info from the HTTP request body, uses Mongoose to populate a user document, then add it to the database
            //Mongoose is translating Node.js code into a MongoDB command that runs behind the scenes to insert a record into your “Users” collection
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          //callback function takes the document you just added as a parameter. Here, this new document is given the name “user”
          //Within this callback, you then send a response back to the client that contains both a status code and the document (called “user”) letting them know their request has been completed
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          //Catch-all error-handling function if any required parameters detailed in the "users" model are not satisfied
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      //Catch-all error-handling function that sends back the message of what error occurred
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  //In order to “READ” a user by their username, you need to pass, as a parameter, an object that contains the criteria by which you want to find that user, which, in this case, is their username
  Users.findOne({ Username: req.params.Username })
    //Send a response back to the client with the user data (document) that was just read
    //The parameter for this callback is named “users”, but it could be called anything
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
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
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
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
      res.status(500).send('Error: ' + err);
    });
});

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );  

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );  

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removoed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );  

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('no such user');
  }
});

//READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});


//READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    return res.status(200).json(movie);
  }
  else {
    res.status(400).send('no such movie');
  }
});


//READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    return res.status(200).json(genre);
  }
  else {
    res.status(400).send('no such genre');
  }
});


//READ
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    return res.status(200).json(director);
  }
  else {
    res.status(400).send('no such director');
  }
});

// Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oh oh, something went wrong. Please try again later.");
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});