const express = require('express'),
  morgan = require('morgan');

const app = express();

let topMovies = [
  {
    Title: "Your Name",
    Director: "Makoto Shinkai",
    Date: 2016,
    IMDb_Rating: "8.4/10",
  },
  {
    Title: "Spirited Away",
    Director: "Hayao Miyazaki",
    Date: 2001,
    IMDb_Rating: "8.6/10",
  },
  {
    Title: "A Silent Voice",
    Director: "Naoko Yamada",
    Date: 2017,
    IMDb_Rating: "8.1/10",
  },
  {
    Title: "Howl's Moving Castle",
    Director: "Hayao Miyazaki",
    Date: 2005,
    IMDb_Rating: "8.2/10",
  },
  {
    Title: "Flavors of Youth",
    Director: "Yoshitaka Takeuchi, Haoling Li, Jiaoshou Yi Xiaoxing",
    Date: 2018,
    IMDb_Rating: "6.6/10", 
  },
  {
    Title: "Weathering With You",
    Director: "Makoto Shinkai",
    Date: 2019,
    IMDb_Rating: "7.5/10",
  },
  {
    Title: "Ponyo",
    Director: "Hayao Miyazaki",
    Date: 2008,
    IMDb_Rating: "7.6/10",
  },
  {
    Title: "Kiki's Delivery Service",
    Director: "Hayao Miyazaki",
    Date: 1990,
    IMDb_Rating: "7.8/10",
  },
  {
    Title: "Perfect Blue",
    Director: "Satoshi Kon",
    Date: 1997,
    IMDb_Rating: "8/10",
  },
  {
    Title: "Akira",
    Director: "Katsuhiro Otomo",
    Date: 1988,
    IMDb_Rating: "8/10",
  },
]

app.use(express.static('public')); //Automatically route request to send back response with a file in the /Public root folder
// setup the logger in terminal
app.use(morgan('common'));


//GET Requests
app.get('/', (req, res) => {
  res.send('Welcome to AnimeFlix!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oh oh, something went wrong. Please try again later.");
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});