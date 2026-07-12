def validate_timetable(
    timetable,
    faculties,
    classrooms
):

    errors = []


    faculty_schedule = {}

    classroom_schedule = {}



    for day, periods in timetable.items():

        for slot in periods:


            if slot.get("subject") is None:
                continue



            faculty = slot.get("faculty")

            classroom = slot.get("classroom")

            period = slot.get("period")



            # Faculty clash check

            faculty_key = (
                day,
                period,
                faculty
            )


            if faculty_key in faculty_schedule:

                errors.append(
                    f"Faculty clash: {faculty}"
                )

            else:

                faculty_schedule[faculty_key] = True




            # Classroom clash check

            room_key = (
                day,
                period,
                classroom
            )


            if room_key in classroom_schedule:

                errors.append(
                    f"Classroom clash: {classroom}"
                )

            else:

                classroom_schedule[room_key] = True



            # Classroom existence check

            room_exists = False


            for room in classrooms:

                if room.name == classroom:

                    room_exists = True
                    break



            if not room_exists:

                errors.append(
                    f"Invalid classroom: {classroom}"
                )



    if len(errors) == 0:

        return {

            "valid": True,

            "errors": []

        }



    return {

        "valid": False,

        "errors": errors

    }