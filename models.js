const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //import bcrypt module for password hashing


let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    }
    /*Actors: [String],
    ImagePath: String,
    Featured: Boolean
    */
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    //states that the FavoriteMovies field within each user document will contain an array ([]) of mongoose.Schema.Types.ObjectId IDs. These IDs reference the “db.movies” collection (ref: 'Movie'). We use the singular “Movie” because that is the name of the model which links the movieSchema to its database collection
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
  
userSchema.methods.validatePassword = function(password) {
    console.log(password, this.Password);
    return bcrypt.compareSync(password, this.Password);
};

//Creating the Models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);


//Exporting the Models
module.exports.Movie = Movie;
module.exports.User = User;