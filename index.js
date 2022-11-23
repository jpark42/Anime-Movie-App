const express = require('express'),
  app = express();
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');

app.use(bodyParser.json()); 


let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: ["Perfect Blue", "Your Name"],
  },

  {
    id: 2,
    name: "Zeke",
    favoriteMovies: ["Your Name"],
  },
]

let movies = [
  {
    "Title": "Your Name",
    "Description": "",
    "Date": 2016,
    "Genre": {
      "Name": "Romance",
      "Description": ""
    },
    "Director": {
      "Name": "Makoto Shinkai",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Spirited Away",
    "Description": "",
    "Date": 2001,
    "Genre": {
      "Name": "Adventure",
      "Description": ""
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "A Silent Voice",
    "Description": "",
    "Date": 2017,
    "Genre": {
      "Name": "Romance",
      "Description": ""
    },
    "Director": {
      "Name": "Naoko Yamada",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Howl's Moving Castle",
    "Description": "",
    "Date": 2005,
    "Genre": {
      "Name": "Adventure",
      "Description": ""
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Flavors of Youth",
    "Description": "",
    "Date": 2018,
    "Genre": {
      "Name": "Romance",
      "Description": ""
    },
    "Director": {
      "Name": "Yoshitaka Takeuchi, Haoling Li, Jiaoshou Yi Xiaoxing",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Weathering With You",
    "Description": "",
    "Date": 2019,
    "Genre": {
      "Name": "Romance",
      "Description": ""
    },
    "Director": {
      "Name": "Makoto Shinkai",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Ponyo",
    "Description": "",
    "Date": 2008,
    "Genre": {
      "Name": "Adventure",
      "Description": ""
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Kiki's Delivery Service",
    "Description": "",
    "Date": 1990,
    "Genre": {
      "Name": "Adventure",
      "Description": "",
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Perfect Blue",
    "Description": "",
    "Date": 1997,
    "Genre": {
      "Name": "Thriller",
      "Description": ""
    },
    "Director": {
      "Name": "Satoshi Kon",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },

  {
    "Title": "Akira",
    "Description": "",
    "Date": 1988,
    "Genre": {
      "Name": "Sci-fi",
      "Description": ""
    },
    "Director": {
      "Name": "Katsuhiro Otomo",
      "Bio": "",
      "Birth": 1111,
    },
    "ImageURL": "",
    "Featured": false,
  },
]

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

//UPDATE
app.post('/users', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  //2 equal signs because user.id refers to a number and id refers to a string. This makes it truthy and equal to satisfy the condition
  let user = users.find( user => user.id == id );  

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
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