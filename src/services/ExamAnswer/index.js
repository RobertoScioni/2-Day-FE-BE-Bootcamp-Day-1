/* > POST /exam/{id}/answer
    Answer to a question for the given exam {id}.
    Body: 
    {
        question: 0, // index of the question
        answer: 1, // index of the answer
    } // in this case, the answer for the first question is the second choice
    When the answer is provided, the result is kept into the exam and the score is updated accordingly.
    It should not be possible to answer the same question twice.*/
