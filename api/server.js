const express = require('express');
const server = express();

const morgan = require("morgan");
const helmet = require("helmet");

const projectsRouter = require("./projects/projects-router.js");
const actionsRouter = require("./actions/actions-router.js");
// const { validateProjectId,
//         validateActionId,
//         validateProject,
//         validateAction } = require('./middleware.js');


server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res)=> {
    res.send(`This is working!`);
});


// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js


module.exports = server;
