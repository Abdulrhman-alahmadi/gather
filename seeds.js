
const mongoose = require("mongoose");

const eventModel = require("./module/event.js");

mongoose.connect('mongodb://localhost:27017/eventApp').then(() => {
    console.log("connection has been established");
}).catch(err => {
    console.log(err);
});

const pp = new eventModel({ name: "reading togather", date: "2021-05-15", description: "this is a event to read to gather", location: "Virutal using zoom" });

pp.findAllElements();

