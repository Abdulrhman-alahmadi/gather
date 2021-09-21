const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({

    name: {
        type: String,
        require: [true, "please enter the data"]
    },
    date: {
        type: Date,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        require: true,
    },
    image: {
        type: String,
    },
    owner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    creationDate: {
        type: Date,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
});


eventSchema.method('findAllElements', async function (ele) {
    const arr = await event.find();
    return arr;

})

eventSchema.method('InsertNewEvent', async function (event) {
    event.save().then((ele) => {
        console.log("inserted.....");
    }).catch((err) => {
        console.log("err");
    })
})




const event = mongoose.model("Event", eventSchema);



module.exports = event;
