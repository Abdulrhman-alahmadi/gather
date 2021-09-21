
const eventModel = require('../module/event.js')
const session = require('express-session');
const userModel = require('../module/user.js');

module.exports.renderCreateEventForm = (req, res) => {

    if (req.session.user_id) {

        res.render("new.ejs");
    } else {
        res.render('login.ejs')
    }
};

module.exports.renderEventView = async (req, res, next) => {


    // the viwer is a user.
    try {

        const currentEvent = await eventModel.findById(req.params.id);
        // check if there is a memebrs and group them in a lis
        let isRolled = false;
        let rolledUsers = [];
        console.log("im here ?");
        console.log(currentEvent.members.length);
        for (let index = 0; index < currentEvent.members.length; index++) {
            if (req.session.currentUser && currentEvent.members[index]._id == req.session.currentUser._id) {
                //same user. dont show him the enroll button.
                isRolled = true;
            }



            let user = await userModel.findById(currentEvent.members[index]._id);
            rolledUsers.push(user)


        }

        res.render("viewevent.ejs", { currentEvent: currentEvent, members: rolledUsers, isRolled: isRolled });
    } catch (e) {
        console.log(e);
        req.flash('error', 'erorr happened!!');
        res.redirect('/home');
    }



};

module.exports.renderEditForm = async (req, res) => {
    try {
        const currentEvent = await eventModel.findById(req.params.id)

        if (currentEvent.owner == req.session.currentUser._id) {
            const currentEvent = await eventModel.findById(req.params.id)
            res.render('editevent.ejs', { currentEvent })
        } else {
            // the user is not sign in.
            req.flash('error', 'your not the owner of this event to change it!');
            res.redirect('/home');
        }
    } catch (e) {
        req.flash('error', 'an error occur please try again!');
        res.redirect('/home');
    }

};

module.exports.createEventProcess = async (req, res) => {
    try {
        let createdEvent = new eventModel({ name: req.body.eventname, date: req.body.date, description: req.body.eventdesc, location: req.body.eventloc, image: req.body.eventImage, owner: req.session.currentUser._id, creationDate: new Date() });
        await createdEvent.save();
        req.flash('success', 'Successfully made a new event!');
        res.redirect("/currentevent");

    } catch (e) {
        req.flash('error', 'we cant create new event right now please try again!');
        res.redirect("/new");
    }

};
module.exports.editProcess = async (req, res) => {

    try {
        const id = req.params.id;
        if (req.session.currentUser) {
            const currentEvent = await eventModel.findByIdAndUpdate(id, {
                name: req.body.eventname, date: req.body.date, description: req.body.eventdesc, location: req.body.eventloc,
                image: req.body.eventImage, owner: req.session.currentUser._id, creationDate: new Date()
            });

            req.flash('sucess', 'the event has been updated!');
            res.redirect('/currentevent/' + req.params.id);

        }
    } catch (e) {
        req.flash('error', 'an error occur please try again!');
        res.redirect('/home');
    }
};

module.exports.deleteProcess = async (req, res) => {

    try {
        const currentEvent = await eventModel.findById(req.params.id)
        if (currentEvent.owner == req.session.currentUser._id) {
            const deleteProcess = await eventModel.findByIdAndDelete(req.params.id).then({
            }).catch((e) => {

            });
            console.log(deleteProcess);
            req.flash('success', 'event has been deleted!');
            res.redirect('/currentevent');
        } else {
            // the user is not sign in.
            req.flash('error', 'Please sign in first!');
            res.redirect('/currentevent');
        }
    } catch (e) {
        req.flash('error', 'an error occur please try again!');
        res.redirect('/currentevent');
    }

};

module.exports.renderCurrentEvents = async (req, res) => {
    const allEvents = await eventModel.find();
    res.render("currentevent.ejs", { allEvents });
};

module.exports.enrollProcess = async (req, res) => {

    if (req.session.currentUser) {
        try {
            //get the event..
            let currentEvent = await eventModel.findById(req.params.id);
            currentEvent.members.push(req.session.currentUser._id);
            await currentEvent.save();
            req.flash("success", 'enrolled successfuly!');
            res.redirect('/currentevent/' + req.params.id);

        } catch (e) {
            console.log(e);
            req.flash('error', 'erorr happened!!');
            res.redirect('/currentevent');
        }

    } else {
        req.flash('error', 'you must sign in first!!');
        res.redirect('/currentevent');
    }

};