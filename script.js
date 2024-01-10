document.addEventListener("DOMContentLoaded", function() {
    const quizQuestions = [];
    const form = document.getElementById('quiz-form');
    const select = form.querySelector('select');
    const questionsList = document.getElementById('questions-list');


    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const newQuestion = {
        question: form.question.value,
        options: [
          { text: form.option1.value },
          { text: form.option2.value },
          { text: form.option3.value },
          { text: form.option4.value },
        ],
        correctIndex: parseInt(select.value.charAt(select.value.length - 1)) - 1,
      };
      
      quizQuestions.push(newQuestion);
      displayQuestions();
      form.reset();
    });
  });