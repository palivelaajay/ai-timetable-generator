from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.input_model import GenerateRequest

from services.ai_engine import generate_optimized_schedule

from services.validator import validate_timetable



app = FastAPI(
    title="AI Timetable Generator",
    version="1.0"
)



# MERN Frontend Connection

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)



@app.get("/")
def home():

    return {

        "success": True,

        "message": "AI Timetable Service Running"

    }




@app.post("/generate")
def generate_timetable(data: GenerateRequest):

    try:


        timetable = generate_optimized_schedule(

            data.subjects,

            data.faculties,

            data.classrooms,

            data.working_days,

            data.periods_per_day,

            data.class_timings

        )



        validation = validate_timetable(

            timetable,

            data.faculties,

            data.classrooms

        )



        if validation["valid"] is False:


            return {

                "success": False,

                "message": "Timetable validation failed",

                "errors": validation["errors"]

            }



        return {

            "success": True,

            "message": "Optimized timetable generated successfully",

            "validated": True,

            "data": {

                "timetable": timetable

            }

        }



    except Exception as e:


        print("ERROR:", e)


        return {

            "success": False,

            "message": str(e)

        }