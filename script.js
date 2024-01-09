document.addEventListener("DOMContentLoaded", function () {
    const quizQuestions = [];
    const quizForm = document.getElementById("quiz-form");
    const options = quizForm.querySelectorAll('input[type="text"]');
    const select = document.getElementById("correct-answer");

    quizForm.addEventListener("submit", function(event){
        event.preventDefault();
        const newQuestionText = document.getElementById("questionInput").value;
        const correctIndex = parseInt(select.value) - 1;
        options.forEach((option,index)=>{
            option.style.backgroundColor = index === correctIndex ? "green" : "red";
        });

        const newOption = [];
        for (let i = 0; i < options.length; i++) {
            newOption.push({
                text: options[i].value,
                isCorrect: i === correctIndex,
            });
        }

        if (newQuestionText.length <= 140){
            const newQuestion = {
                question: newQuestionText,
                options: newOption,
            };
            quizQuestions.push(newQuestion);
            
        } else{
            alert("Question must be less than 140 characters");
        }
    });
});

