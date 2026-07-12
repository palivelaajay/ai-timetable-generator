const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const timetableRoutes = require("./routes/timetable");


const app = express();


// Middleware

app.use(cors());

app.use(express.json());


// Database connection

connectDB();


// Routes

app.use(
    "/api/timetable",
    timetableRoutes
);



// Test API

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "MERN Backend Running"

    });

});



// Start server

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});