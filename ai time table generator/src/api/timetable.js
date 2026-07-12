const express = require('express');
const router = express.Router();
const { Timetable, Faculty, Subject, Classroom } = require('../models/Timetable');
const TimetableService = require('../services/timetableService');

router.post('/generate', (req, res) => {
    const { workingDays, periodsPerDay, breakTimings, faculty, subjects, classrooms } = req.body;

    const facultyList = faculty.map(f => new Faculty(f.id, f.name, f.availability, f.maxPeriodsPerDay));
    const subjectList = subjects.map(s => new Subject(s.id, s.name, s.hoursPerWeek, s.needsLab));
    const classroomList = classrooms.map(c => new Classroom(c.id, c.name, c.isLab));

    const timetable = new Timetable(workingDays, periodsPerDay, breakTimings, facultyList, subjectList, classroomList);
    const timetableService = new TimetableService(timetable);
    const generatedTimetable = timetableService.generate();

    res.json(generatedTimetable);
});

module.exports = router;