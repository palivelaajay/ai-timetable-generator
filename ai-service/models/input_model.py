from pydantic import BaseModel

from models.timing_model import PeriodTiming
from models.break_model import BreakTiming



class Subject(BaseModel):

    name: str

    faculty: str

    weekly_frequency: int

    priority: int = 1

    # normal = 1 period
    # lab = multiple continuous periods
    duration: int = 1

    # classroom / lab
    required_room_type: str = "classroom"




class Faculty(BaseModel):

    name: str

    availability: list[str]

    max_periods_per_day: int

    max_periods_per_week: int = 20




class Classroom(BaseModel):

    name: str

    # classroom or lab
    type: str = "classroom"




class GenerateRequest(BaseModel):

    working_days: list[str]

    periods_per_day: int

    class_timings: list[PeriodTiming]

    break_timings: list[BreakTiming] = []

    subjects: list[Subject]

    faculties: list[Faculty]

    classrooms: list[Classroom]