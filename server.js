var   express                 = require('express'),
      app                     = express(),
      methodOverride          = require("method-override"),
      flash                   = require("connect-flash"),
      bodyParser              = require("body-parser"),
      mongoose                = require("mongoose");
      passport                = require("passport");
      //jwt will create the token
      //passport will validate 

//Require Routes
const  profile = require("./routes/api/profile");
const  users   = require("./routes/api/users");
const  posts   = require("./routes/api/posts");

//DB Config
const db = require('./config/keys').mongoURI;

//connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch( err => console.log("Connection to DB failed: "+err))

//Set Port
app.set('port', (process.env.PORT ||3004))
//ejs engine
app.set('view engine', 'ejs');
//Static files
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash()); //connect-flash
app.use(bodyParser.urlencoded({extended: false})); //extended false uses qs
app.use(bodyParser.json())

  //Express session
app.use(require("express-session")({
  secret:"Caws and horses are funny animals",
  resave: false,
  saveUninitialized: false
}));

//make variables global
app.use(function(req, res, next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
//Export routes or you will get an error
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


app.listen(app.get('port'), function() {
  console.log("jpaulino app is running at localhost:" + app.get('port'))
});
