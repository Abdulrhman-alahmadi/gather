const session = require('express-session');
const bcrypt = require('bcryptjs');
const userModel = require("../module/user.js");


module.exports.login = async (req, res) => {

    try {
        const isExists = await userModel.findOne({ email: req.body.email })
        if (isExists) {
            // check for password using bcyrpt
            const check = await bcrypt.compare(req.body.password, isExists.password);
            if (check) {
                req.session.user_id = isExists.id;
                req.session.currentUser = isExists;
                res.redirect('/new');
            } else {
                req.flash('error', 'The email or password you entered is invalid!..');
                res.redirect('/new');
            }
        } else {
            req.flash('error', 'The email or password you entered is invalid!');
            res.redirect('/login');
        }
    } catch (e) {
        req.flash('error', 'an error occur please try again!');
    }
};

module.exports.renderLoginForm = async (req, res) => {

    if (req.session.user_id) {
        res.redirect('/home')
    } {
        res.render('login.ejs')
    }
    // the user already signed in.

};


module.exports.register = async (req, res) => {
    try {
        if (req.body.password == req.body.confirmpassword) {
            const isExists = await userModel.findOne({ email: req.body.email })
            if (!isExists) {
                const saltRounds = await bcrypt.genSalt();
                const pass = await bcrypt.hash(req.body.password, saltRounds);
                const user = new userModel({ username: req.body.username, password: pass, email: req.body.email });
                user.save().then((ele) => {
                    res.redirect('/new');
                });
            } else {
                // email is already in our db
                req.flash('error', 'the email already been used. choose another one..');
                res.redirect('/registration');
            }

        } else {
            // not same password
            req.flash('error', 'please make sure that the password and confirm password are the same..');
            res.redirect('/registration');
        }

    } catch (e) {
        req.flash('error', 'an error occur please try again!');
        res.redirect('/registration');
    }

};

module.exports.renderRegistrationForm = (req, res) => {
    res.render('registration.ejs');
};


module.exports.logout = (req, res) => {
    if (res.locals.user) {
        req.session.user_id = null;
        req.session.currentUser = null;
        req.flash("success", "See you Soon!")
        res.redirect('/home');
    } else {
        res.redirect('/home');
    }


};

module.exports.renderHome = async (req, res) => {
    res.render("home.ejs");
};