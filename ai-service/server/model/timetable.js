const mongoose = require("mongoose");


const timetableSchema = new mongoose.Schema({

    name: {

        type: String,

        default: "Generated Timetable"

    },


    timetable: {

        type: Object,

        required: true

    },


    createdAt: {

        type: Date,

        default: Date.now

    }

});


module.exports = mongoose.model(
    "Timetable",
    timetableSchema
);