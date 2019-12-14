//Libraries
const express = require('express')
const helmet = require('helmet')
//local files
const projectsRouter = require('./projects/projectsRouter')
const actionsRouter = require('./actions/actionsRouter')
//Build server powered by express
const server = express()

//Middleware
//global
server.use(helmet())
server.use(express.json())

//routers
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)


server.get('/', (req, res) => {
    const messageOfTheDay = process.env.MOTD 
    res.send(`<h2>${messageOfTheDay}</h2>`)
})

server.use((err, req, res, next) => {
    res.status(500).json({
        message: "Bad mistake!", err
    })
})

module.exports = server