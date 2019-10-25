const PORT = 3000;

// ----------------------------------------------
// IMPORT MODULES
// ----------------------------------------------
const express = require("express");
const path = require("path");
const session = require("express-session");
const pageRouter = require("./routes/pages");
const flash = require("req-flash");
const methodOverride = require("method-override");

var app = express();

// ----------------------------------------------
// CONFIGURE THE APP
// ----------------------------------------------
// server public folder
app.use(express.static(path.join(__dirname, "public")));
// set the view engine as ejs
app.set("view engine", "ejs");
// body-parsser
app.use(express.urlencoded({ extended: false }));
// express-session
app.use(session({
    secret: "a_secret_sentence",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));
// use flash message
app.use(flash());
// use method-override
app.use(methodOverride('_method'));

// ----------------------------------------------
// ROUTES
// ----------------------------------------------
// routes
app.use("/", pageRouter);

// ----------------------------------------------
// HANDLE INVALID ROUTES
// ----------------------------------------------
// error: page not found
app.use((req, res, next) => {
    var err = new Error("page not found");
    err.status = 404;
    next(err);
});

// handle error
app.use((err, req, res, next) => {
    res.status(err.status || 500);
});

// ----------------------------------------------
// LISTEN FOR REQUESTS AT PORT 3000
// ----------------------------------------------
app.listen(PORT, () => {
    console.log("server is running at port " + PORT + "...");
});

module.exports = app;