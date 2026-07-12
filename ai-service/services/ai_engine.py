from ortools.sat.python import cp_model

from services.optimizer import create_optimization_model



def generate_optimized_schedule(
    subjects,
    faculties,
    classrooms,
    working_days,
    periods_per_day,
    class_timings
):

    model, assignments = create_optimization_model(
        subjects,
        faculties,
        classrooms,
        working_days,
        periods_per_day
    )


    solver = cp_model.CpSolver()

    status = solver.Solve(model)


    if status not in (
        cp_model.OPTIMAL,
        cp_model.FEASIBLE
    ):
        return {
            "error": "No valid timetable found"
        }



    timetable = {}


    for day in working_days:

        timetable[day] = []


        for period in range(periods_per_day):

            selected_subject = None
            selected_faculty = None


            for subject in subjects:

                key = (
                    subject.name,
                    day,
                    period
                )


                if solver.Value(assignments[key]) == 1:

                    selected_subject = subject.name
                    selected_faculty = subject.faculty

                    break



            timing = class_timings[period]


            classroom = classrooms[0].name



            timetable[day].append(
                {

                    "period": period + 1,

                    "time":
                    f"{timing.start_time} - {timing.end_time}",

                    "subject": selected_subject,

                    "faculty": selected_faculty,

                    "classroom": classroom

                }
            )


    return timetable