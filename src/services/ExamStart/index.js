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
