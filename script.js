document.addEventListener("DOMContentLoaded", function() {
    const quizQuestions = [];
    const form = document.getElementById('quiz-form');
    const select = form.querySelector('select');
    const questionsList = document.getElementById('questions-list');
    const dialog = document.getElementById('dialog');

    function showDialog(message) {
      dialog.textContent = message;
      dialog.showModal();
      setTimeout(() => dialog.close(), 2000);
    }

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
      showDialog("Question added successfully!");
      displayQuestions();
      form.reset();
    });
    function displayQuestions() {
        questionsList.innerHTML = '';
        quizQuestions.forEach((question, index) => {
          const listItem = document.createElement('li');
          const questionText = document.createElement('p');
          questionText.textContent = `Question ${index + 1}: ${question.question}`;
          listItem.appendChild(questionText);
          const optionsList = document.createElement('ul');
          question.options.forEach((option, i) => {
            const optionItem = document.createElement('li');
            const optionText = document.createElement('span');
            optionText.textContent = `Option ${i + 1}: ${option.text}`;
            optionItem.appendChild(optionText);

            if (question.isForPlay){
                if (i === question.selectedAnswerIndex){
                    if (i===question.correctIndex){
                        optionItem.style.color = "green";
                    }else{
                        optionItem.style.color = "red";
                    }
                }
            }
            optionsList.appendChild(optionItem);
          });
          listItem.appendChild(optionsList);
  
          const revealButton = document.createElement('button');
          revealButton.textContent = 'Reveal Answer';
          revealButton.addEventListener('click', function() {
            revealAnswer(index);
          });
          listItem.appendChild(revealButton);
          questionsList.appendChild(listItem);
        });
      }
      function revealAnswer(index) {
        const correctIndex = quizQuestions[index].correctIndex;
        const correctAnswerText = quizQuestions[index].options[correctIndex].text;
        alert(`The correct answer for question ${index + 1} is: ${correctAnswerText}`);
    }
  
      function filterQuestions(searchTerm) {
        const filteredQuestions = quizQuestions.filter(question =>
          question.question.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredQuestions;
      }
      const searchInput = document.getElementById('searchInput');
      searchInput.addEventListener('input', function() {
          const searchTerm = this.value;
          const filtered = filterQuestions(searchTerm);
          displayFilteredQuestions(filtered);
        });
  
        function displayFilteredQuestions(questions) {
          questionsList.innerHTML = ''; // Clear the previous list items
        
          questions.forEach((question, index) => {
            // Create a list item for each question
            const listItem = document.createElement('li');
        
            // Create a paragraph to display the question text
            const questionText = document.createElement('p');
            questionText.textContent = `Question ${index + 1}: ${question.question}`;
            listItem.appendChild(questionText);
        
            // Create a list to display options
            const optionsList = document.createElement('ul');
            question.options.forEach((option, i) => {
              // Create list items for each option
              const optionItem = document.createElement('li');
              const optionText = document.createElement('span');
              optionText.textContent = `Option ${i + 1}: ${option.text}`;
              optionItem.appendChild(optionText);
              optionsList.appendChild(optionItem);
            });
            listItem.appendChild(optionsList);
        
            // Create a button to reveal the correct answer
            const revealButton = document.createElement('button');
            revealButton.textContent = 'Reveal Answer';
            listItem.appendChild(revealButton);
            listItem.appendChild(revealButton);
      
            // Add the list item to the questions list
            questionsList.appendChild(listItem);
          });
        }
  });