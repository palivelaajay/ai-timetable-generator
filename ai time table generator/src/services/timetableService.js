const { Timetable } = require('../models/Timetable');

class TimetableService {
    constructor(timetable) {
        this.timetable = timetable;
        this.populationSize = 100;
        this.mutationRate = 0.1;
        this.crossoverRate = 0.9;
        this.elitismCount = 2;
    }

    generate() {
        let population = this._initializePopulation();

        for (let i = 0; i < 100; i++) {
            population = this._evolve(population);
        }

        const bestTimetable = this._getBestTimetable(population);
        this.timetable.schedule = this._formatTimetable(bestTimetable);
        return this.timetable.schedule;
    }

    _initializePopulation() {
        const population = [];
        for (let i = 0; i < this.populationSize; i++) {
            population.push(this._createRandomTimetable());
        }
        return population;
    }

    _createRandomTimetable() {
        const schedule = {};
        this.timetable.workingDays.forEach(day => {
            schedule[day] = {};
            this.timetable.periods.forEach(period => {
                const subject = this.timetable.subjects[Math.floor(Math.random() * this.timetable.subjects.length)];
                const faculty = this.timetable.faculty[Math.floor(Math.random() * this.timetable.faculty.length)];
                const classroom = this.timetable.classrooms[Math.floor(Math.random() * this.timetable.classrooms.length)];
                schedule[day][period] = { subject, faculty, classroom };
            });
        });
        return schedule;
    }

    _evolve(population) {
        const newPopulation = [];

        // Elitism
        const elite = this._getElite(population);
        newPopulation.push(...elite);

        while (newPopulation.length < this.populationSize) {
            const parent1 = this._select(population);
            const parent2 = this._select(population);

            let child = this._crossover(parent1, parent2);
            child = this._mutate(child);

            newPopulation.push(child);
        }

        return newPopulation;
    }

    _getElite(population) {
        return population.sort((a, b) => this._calculateFitness(b) - this._calculateFitness(a)).slice(0, this.elitismCount);
    }

    _select(population) {
        const tournamentSize = 5;
        let best = null;

        for (let i = 0; i < tournamentSize; i++) {
            const individual = population[Math.floor(Math.random() * population.length)];
            if (best === null || this._calculateFitness(individual) > this._calculateFitness(best)) {
                best = individual;
            }
        }

        return best;
    }

    _crossover(parent1, parent2) {
        if (Math.random() > this.crossoverRate) {
            return parent1;
        }

        const child = {};
        this.timetable.workingDays.forEach(day => {
            child[day] = {};
            this.timetable.periods.forEach(period => {
                child[day][period] = Math.random() > 0.5 ? parent1[day][period] : parent2[day][period];
            });
        });

        return child;
    }

    _mutate(individual) {
        this.timetable.workingDays.forEach(day => {
            this.timetable.periods.forEach(period => {
                if (Math.random() < this.mutationRate) {
                    const subject = this.timetable.subjects[Math.floor(Math.random() * this.timetable.subjects.length)];
                    const faculty = this.timetable.faculty[Math.floor(Math.random() * this.timetable.faculty.length)];
                    const classroom = this.timetable.classrooms[Math.floor(Math.random() * this.timetable.classrooms.length)];
                    individual[day][period] = { subject, faculty, classroom };
                }
            });
        });
        return individual;
    }

    _calculateFitness(individual) {
        let fitness = 1.0;
        let clashes = 0;

        this.timetable.workingDays.forEach(day => {
            this.timetable.periods.forEach(period => {
                const slot = individual[day][period];

                // Check for faculty clashes
                this.timetable.periods.forEach(p => {
                    if (p !== period) {
                        const otherSlot = individual[day][p];
                        if (otherSlot.faculty.id === slot.faculty.id) {
                            clashes++;
                        }
                    }
                });

                // Check for classroom clashes
                this.timetable.periods.forEach(p => {
                    if (p !== period) {
                        const otherSlot = individual[day][p];
                        if (otherSlot.classroom.id === slot.classroom.id) {
                            clashes++;
                        }
                    }
                });
            });
        });

        return fitness / (clashes + 1);
    }

    _getBestTimetable(population) {
        return population.reduce((best, current) => {
            return this._calculateFitness(current) > this._calculateFitness(best) ? current : best;
        });
    }

    _formatTimetable(schedule) {
        const formatted = {};
        this.timetable.workingDays.forEach(day => {
            formatted[day] = {};
            this.timetable.periods.forEach(period => {
                const { subject, faculty, classroom } = schedule[day][period];
                formatted[day][period] = {
                    subject: subject.name,
                    faculty: faculty.name,
                    classroom: classroom.name
                };
            });
        });
        return formatted;
    }
}

module.exports = TimetableService;