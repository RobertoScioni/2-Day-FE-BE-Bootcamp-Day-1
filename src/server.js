/**
 * external module
 */
const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
/**
 * internal modules
 */
const { badRequest, funny, catchAllHandler } = require("./services/error")
const ExamsRoutes = require("./services/Exams")

/**
 * initializations
 */
const server = express()
const port = process.env.PORT || 2001
const publicFolder = process.env.PUBLIC || join(__dirname, "../public")

//server initialization process
server.use(cors())
server.use(express.json())
server.use("/exams", ExamsRoutes)
server.use(badRequest)
server.use(catchAllHandler)

/**
 * start
 */
server.listen(port, () => {
	//console.clear()
	console.log("server running on port: ", port)
	console.log(listEndpoints(server))
})
