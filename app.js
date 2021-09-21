
const express = require('express')
const app = express()
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const mongoSanitize = require('express-mongo-sanitize');


var methodOverride = require('method-override');


//my exports
const eventModel = require("./module/event.js")
const userModel = require("./module/user.js");
const userController = require('./controller/userscontroller.js');
const eventController = require('./controller/eventcontroller.js');
const appError = require('./AppError.js');

// temp ele to use all the methods avalaibel.
const tempEle = new eventModel();

// change the session to be from browser to mongo .. 

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ secret: "this is not a good secret", resave: false, saveUninitialized: false }));
app.use(mongoSanitize());
app.use(flash());


// user my routes

// to use files from public folder.
app.use(express.static('public'));


const mongoose = require('mongoose');
const AppError = require('./AppError.js');

// user mongo atlas .


const dbUrl = process.env.LINK || 'mongodb://localhost:27017/eventApp';
mongoose.connect(dbUrl).then(() => {
    console.log("connection has been established");
}).catch(err => {
    console.log(err);
});

app.use((req, res, next) => {
    res.locals.user = req.session.currentUser;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

})


app.get('/', (req, res) => {
    res.redirect('/home');
})
app.post('/home', eventController.createEventProcess);

// regester and log in routes.

app.post('/login', userController.login);

app.get('/login', userController.renderLoginForm)

app.post('/register', userController.register);

// home and events rotes

app.get('/logout', userController.logout)

app.get('/registration', userController.renderRegistrationForm);

app.get('/home', userController.renderHome);

app.post('/currentevent/:id/enroll', eventController.enrollProcess)


app.get('/new', eventController.renderCreateEventForm);

app.get('/currentevent/:id', eventController.renderEventView);

app.get('/currentevent/:id/edit', eventController.renderEditForm);

app.post('/currentevent/:id/delete', eventController.deleteProcess)

app.post('/currentevent/:id/edit', eventController.editProcess)

app.get('/currentevent', eventController.renderCurrentEvents)




app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(message);
})

app.use("*", (req, res) => {
    res.send("<h1>Page not found </h1> ")
})

const port = process.env.PORT || 3030;
app.listen(port, (req, res) => {
    console.log("app is listening..... to PORT: ", port);
})