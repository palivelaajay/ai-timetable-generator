# AI Timetable Generator Module

## Overview

AI Timetable Generator is an optimization-based timetable generation system that creates clash-free and optimized college timetables.

The module uses Constraint Programming with OR-Tools and exposes REST APIs using FastAPI.

---

# Features

## Input Handling

The AI module accepts:

- Working days
- Number of periods per day
- Subjects
- Faculty list
- Faculty availability
- Classrooms
- Labs
- Class timings
- Break timings


---

# Optimization Constraints

The system applies the following constraints:

## Faculty Constraints

- No faculty clashes
- Faculty availability checking
- Maximum periods per faculty/day
- Maximum periods per faculty/week


## Classroom Constraints

- No classroom clashes
- Classroom allocation validation


## Subject Constraints

- Weekly subject frequency
- Subject duration handling
- Double period support


## Laboratory Constraints

- Lab subject allocation
- Lab room type checking
- Continuous lab periods


---

# System Architecture

