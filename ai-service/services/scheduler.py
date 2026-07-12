from services.constraints import (
    check_faculty_clash,
    check_classroom_clash,
    check_faculty_availability
)


def create_empty_timetable(working_days, periods_per_day):
    timetable = {}

    for day in working_days:
        timetable[day] = [None] * periods_per_day

    return timetable



def allocate_subjects(
    timetable,
    subjects,
    faculties,
    classrooms,
    class_timings,
    break_timings=[]
):

    days = list(timetable.keys())


    for subject in subjects:

        frequency = subject.weekly_frequency

        placed = 0

        day_index = 0
        period_index = 0


        while placed < frequency:

            day = days[day_index]


            current_timing = class_timings[period_index]


            # Check if current slot is a break
            is_break = False

            for br in break_timings:

                if (
                    br.start_time == current_timing.start_time
                    and br.end_time == current_timing.end_time
                ):
                    is_break = True



            if is_break:

                period_index += 1

                if period_index >= len(class_timings):
                    period_index = 0
                    day_index += 1

                continue



            faculty_available = check_faculty_availability(
                day,
                subject.faculty,
                faculties
            )


            faculty_clash = check_faculty_clash(
                timetable,
                subject.faculty
            )


            classroom = classrooms[0].name


            classroom_clash = check_classroom_clash(
                timetable,
                classroom
            )


            if (
                timetable[day][period_index] is None
                and faculty_available
                and not faculty_clash
                and not classroom_clash
            ):


                timetable[day][period_index] = {

                    "period": current_timing.period_number,

                    "time":
                    f"{current_timing.start_time} - {current_timing.end_time}",

                    "subject": subject.name,

                    "faculty": subject.faculty,

                    "classroom": classroom
                }


                placed += 1



            period_index += 1



            if period_index >= len(class_timings):

                period_index = 0
                day_index += 1



            if day_index >= len(days):

                day_index = 0



    return timetable