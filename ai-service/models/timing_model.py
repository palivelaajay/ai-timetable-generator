from pydantic import BaseModel


class PeriodTiming(BaseModel):
    period_number: int
    start_time: str
    end_time: str