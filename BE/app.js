var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");


//////NUEVO: Para poder usar variables de entorno
require("dotenv").config();
var mongoose = require("mongoose");
var debug = require('debug')('disneyApp:server');


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var moviesRouter = require("./routes/movies");
var seriesRouter = require("./routes/series");
var favoritesRouter = require("./routes/favorites");
var characters_seriesRouter = require("./routes/characters_series");
var characters_moviesRouter = require("./routes/characters_movies");
var rankingRouter = require("./routes/ranking");
var viewsRouter = require("./routes/views");
var watchlaterRouter = require("./routes/watchlater");


var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//const MONGODB_CLUSTER_URI = process.env.MONGODB_CLUSTER_URI;
// Añade el nombre de tu base de datos al final de la URI
//const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
//const fullURI = `${MONGODB_CLUSTER_URI}/${MONGODB_DATABASE_NAME}?retryWrites=true&w=majority&appName=disneyApp`;
//Prueba 
const { MONGODB_CLUSTER_URI, MONGODB_DATABASE_NAME } = process.env;
const fullURI = `${MONGODB_CLUSTER_URI}/${MONGODB_DATABASE_NAME}`;


// MongoDB Atlas DB cluster connection
mongoose
  .connect(fullURI)
  .then(() => debug("MongoDB Atlas DataBase connection successful"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/series", seriesRouter);
app.use("/favorites", favoritesRouter);
app.use("/characters_series", characters_seriesRouter);
app.use("/characters_movies", characters_moviesRouter);
app.use("/ranking", rankingRouter); 
app.use("/views", viewsRouter);
app.use("/watchlater", watchlaterRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;