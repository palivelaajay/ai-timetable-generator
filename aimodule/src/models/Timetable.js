class Faculty {
    constructor(id, name, availability, maxPeriodsPerDay) {
        this.id = id;
        this.name = name;
        this.availability = availability;
        this.maxPeriodsPerDay = maxPeriodsPerDay;
    }
}

class Subject {
    constructor(id, name, hoursPerWeek, needsLab) {
        this.id = id;
        this.name = name;
        this.hoursPerWeek = hoursPerWeek;
        this.needsLab = needsLab;
    }
}

class Classroom {
    constructor(id, name, isLab) {
        this.id = id;
        this.name = name;
        this.isLab = isLab;
    }
}

class Timetable {
    constructor(workingDays, periodsPerDay, breakTimings, faculty, subjects, classrooms) {
        this.workingDays = workingDays;
        this.periodsPerDay = periodsPerDay;
        this.breakTimings = breakTimings; // e.g., { 'Monday': [4], 'Tuesday': [4] }
        this.faculty = faculty;
        this.subjects = subjects;
        this.classrooms = classrooms;
        this.schedule = {};
    }
}

module.exports = { Faculty, Subject, Classroom, Timetable };