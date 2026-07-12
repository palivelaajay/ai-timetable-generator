from pydantic import BaseModel


class BreakTiming(BaseModel):
    name: str
    start_time: str
    end_time: str