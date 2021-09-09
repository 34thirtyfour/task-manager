const express = require('express');
const app = express();
require('./db/mongoose');

const User = require('./models/users');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const port = process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is running on port'+ port);
})

