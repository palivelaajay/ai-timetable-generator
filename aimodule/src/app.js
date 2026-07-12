const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const timetableRouter = require('./api/timetable');
app.use('/api/timetable', timetableRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});