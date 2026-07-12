const express = require("express");
const axios = require("axios");

const Timetable = require("../models/Timetable");


const router = express.Router();



router.post("/generate", async (req, res) => {

    try {


        // Send request to FastAPI AI service

        const response = await axios.post(

            `${process.env.AI_SERVICE_URL}/generate`,

            req.body

        );



        const timetableData = response.data;



        // Save in MongoDB

        const savedTimetable = await Timetable.create({

            timetable: timetableData

        });



        res.json({

            success: true,

            message: "Timetable generated and saved",

            data: savedTimetable

        });



    } catch (error) {


        console.log(error.message);


        res.status(500).json({

            success: false,

            message: "Failed to generate timetable"

        });

    }

});



module.exports = router;