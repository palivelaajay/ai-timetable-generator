from ortools.sat.python import cp_model



def create_optimization_model(
    subjects,
    faculties,
    classrooms,
    working_days,
    periods_per_day
):

    model = cp_model.CpModel()


    assignments = {}



    for subject in subjects:

        for day in working_days:

            for period in range(periods_per_day):

                key = (
                    subject.name,
                    day,
                    period
                )

                assignments[key] = model.NewBoolVar(
                    f"{subject.name}_{day}_{period}"
                )



    # -----------------------------
    # Duration / Continuous Period
    # -----------------------------

    for subject in subjects:


        if subject.duration > 1:


            for day in working_days:


                possible_starts = []


                for start in range(
                    periods_per_day - subject.duration + 1
                ):


                    block = []


                    for p in range(
                        start,
                        start + subject.duration
                    ):

                        block.append(

                            assignments[
                                (
                                    subject.name,
                                    day,
                                    p
                                )
                            ]

                        )



                    start_var = model.NewBoolVar(
                        f"{subject.name}_{day}_start_{start}"
                    )


                    possible_starts.append(start_var)



                    for p in range(
                        start,
                        start + subject.duration
                    ):

                        model.Add(

                            assignments[
                                (
                                    subject.name,
                                    day,
                                    p
                                )
                            ]

                            == start_var

                        )



                model.Add(
                    sum(possible_starts) <= 1
                )



    # -----------------------------
    # Subject frequency
    # -----------------------------

    for subject in subjects:


        all_slots = []


        for day in working_days:

            for period in range(periods_per_day):

                all_slots.append(

                    assignments[
                        (
                            subject.name,
                            day,
                            period
                        )
                    ]

                )



        model.Add(

            sum(all_slots)

            == subject.weekly_frequency

        )



    return model, assignments