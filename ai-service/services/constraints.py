def check_faculty_clash(schedule, faculty):
    occupied_slots = set()

    for day, periods in schedule.items():
        for period, data in enumerate(periods):

            if data is not None:
                if data["faculty"] == faculty:

                    slot = (day, period)

                    if slot in occupied_slots:
                        return True

                    occupied_slots.add(slot)

    return False



def check_classroom_clash(schedule, classroom):
    occupied_slots = set()

    for day, periods in schedule.items():
        for period, data in enumerate(periods):

            if data is not None:
                if data["classroom"] == classroom:

                    slot = (day, period)

                    if slot in occupied_slots:
                        return True

                    occupied_slots.add(slot)

    return False



def check_faculty_availability(day, faculty, faculty_data):

    for person in faculty_data:

        if person.name == faculty:

            if day in person.availability:
                return True

            return False

    return False