/*POST /exams/start 
    Generate a new Exam with 5 randomly picked questions in it. The questions can be read from the questions.json file provided.
    
    {
    "_id":"5fd0de8f2bf2321fe8743f1f", // server generated
    "candidateName": "Tobia",
    "examDate": "2021-01-07T10:00:00.000+00:00", // server generated
    "isCompleted":false, // false on creation
    "name":"Admission Test",
    "totalDuration": 30, // used only in extras
    "questions":[ // randomly picked from questions.json
        {
        "providedAnswer": 0, // added when the user provides an answer (not on creation)
        "duration":60,
        "text":"This is the text of the first question",
        "answers":[
            {
            "text":"Text for the first answer",
            "isCorrect":false
            },
            {
            "text":"Text for the second answer",
            "isCorrect":true
            },{
            "text":"Text for the third answer",
            "isCorrect":false
            },{
            "text":"Text for the fourth answer",
            "isCorrect":false
            }]
        },
        {
        // second randomly picked question
        },
        {
        // third randomly picked question
        }, 
        {
        // fourth randomly picked question
        },
        {
        // fifth randomly picked question
        },         
      ]
    }
    Returns:
    Full exam object, including questions and answers. The response contains the exam id and does not contain any clue about the correct answer*/

//internal modules
const { response } = require("express")
const express = require("express")
const { join } = require("path")
const fs = require("fs-extra")
const uniqId = require("uniqid")
const rnd = require("unique-random")
//config
const QuestionPath = join(__dirname, "questions.json")
const ExamsPath = join(__dirname, "Exams.json")
const QuestionNumber = 5
//initialization
const router = express.Router()

const DrawQuestions = async (lenght) => {
	try {
		Questions = await fs.readJSON(QuestionPath)
	} catch (error) {
		error.httpStatusCode = 500
		console.error(error)
		return error
	}
	let questionIndexes = []

	for (let index = 0; index < QuestionNumber; index++) {
		questionIndexes[index] = rnd(1, Questions.length)()
	}
	console.log(Questions.length, " questions loaded")
	console.log(questionIndexes, " questions selected")
	return questionIndexes.map((index) => Questions[index])
}

router.post("/start", async (req, res, next) => {
	const exam = { ...req.body, isCompleted: false, totalDuration: 0 }
	try {
		const questions = await DrawQuestions(QuestionNumber)
		exam.questions = questions
	} catch (error) {
		console.error(error)
		error.httpStatusCode = 500
		return next(error)
	}
	exam.questions.forEach((question) => {
		exam.totalDuration += question.duration
	})
	exam._id = uniqId()
	exam.date = new Date()
	console.log(exam, "New Exam Object")
	res.send(exam._id)
	let exams = []
	try {
		exams = await fs.readJSON(ExamsPath)
	} catch (error) {
		console.log("this is the first exam we create")
		exams = []
	}
	console.log(exams, "exams")
	exams.push(exam)
	console.log(exams, "updated exams")
	fs.outputJSON(ExamsPath, exams)
	return exam
})

router.post("/:id/answer", async (req, res, next) => {
	let exam = 0
	let exams = []
	try {
		exams = await fs.readJSON(ExamsPath)
		exam = exams.findIndex((element) => element._id === req.params.id)
	} catch (error) {
		console.error(error)
		error.httpStatusCode = 500
		return next(error)
	}

	console.log(
		"-----------------------------------------------------------------"
	)
	try {
		if (exams[exam].questions[req.body.question].hasOwnProperty("answer")) {
			throw new Error("Attempted Multiple Answers!!!")
		}
		if (
			req.body.question < 0 ||
			req.body.question >= exams[exam].questions.length
		) {
			throw new Error("question out of bounds")
		}
		if (
			req.body.answer < 0 ||
			req.body.answer >= exams[exam].questions[req.body.question].answers.length
		) {
			throw new Error("answer out of bounds")
		}
	} catch (error) {
		error.httpStatusCode = 400
		return next(error)
	}
	exams[exam].questions[req.body.question].answer = req.body.answer
	console.log(exams[exam].hasOwnProperty("answer"))
	console.log(exams[exam])
	//console.log(exams[exam].questions[req.body.question])

	//fs.outputJSON(ExamsPath, exams)
	return res.sendStatus(200)
})

router.get("/:id", async (req, res, next) => {
	let exam = {}
	let exams = []
	let score = 0
	try {
		exams = await fs.readJSON(ExamsPath)
		exam = exams.find((element) => element._id === req.params.id)
		if (!exam) {
			throw new Error("incorrect Exam ID")
		}
	} catch (error) {
		console.error(error)
		error.httpStatusCode = 500
		return next(error)
	}

	console.log(
		"-----------------------------------------------------------------"
	)
	exam.questions.forEach((question) => {
		if (question.hasOwnProperty("answer")) {
			score += question.answers[question.answer].isCorrect ? 1 : -1
		}
	})

	//console.log(exams[exam].questions[req.body.question])

	//fs.outputJSON(ExamsPath, exams)
	exam.score = score
	return res.send(exam)
})

module.exports = router
