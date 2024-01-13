document.addEventListener("DOMContentLoaded", function () {
    //Elements
    const quizQuestions = [];
    const firstPage = document.getElementById('first-page');
    const form = document.getElementById('quiz-form');
    const select = form.querySelector('select');
    const questionsList = document.getElementById('questions-list');
    const quizDisplay = document.getElementById('quiz-display');
    const dialog = document.getElementById('dialog');
    const playerNamesForm = document.getElementById('player-names-form');
    const player1 = document.getElementById('player1-name');
    const player2 = document.getElementById('player2-name');
    const quizListContainer = document.getElementById('quiz-list-container');
    const startQuizButton = document.getElementById('startQuiz');
    const player1ScoreDisplay = document.getElementById('player1-points');
    const player2ScoreDisplay = document.getElementById('player2-points');
    const player1ScoreUpButton = document.getElementById('player1-score-up');
    const player1ScoreDownButton = document.getElementById('player1-score-down');
    const player2ScoreUpButton = document.getElementById('player2-score-up');
    const player2ScoreDownButton = document.getElementById('player2-score-down');
    const currentPlayerDisplay = document.getElementById('current-player');

    //Variables
    let currentPlayer = 1;
    let currentQuestionIndex = 0;
    let player1Score = 0;
    let player2Score = 0;

    //Event listeners for score button
    player1ScoreUpButton.addEventListener('click', function () {
      updateScore('player1', 1);
    });

    player1ScoreDownButton.addEventListener('click', function () {
      updateScore('player1', -1);
    });

    player2ScoreUpButton.addEventListener('click', function () {
      updateScore('player2', 1);
    });

    player2ScoreDownButton.addEventListener('click', function () {
      updateScore('player2', -1);
    });

    //Function to update players score
    function updateScore(player, change) {
      const scoreDisplay = player === 'player1' ? player1ScoreDisplay : player2ScoreDisplay;
      if (player === 'player1') {
        player1Score += change;
      } else {
        player2Score += change;
      }
      scoreDisplay.textContent = player === 'player1' ? player1Score : player2Score;
    }

    //Event listeners for start quiz button
    startQuizButton.addEventListener('click', function () {
        quizListContainer.style.display = 'none';
        firstPage.style.display = 'none';
      const player1Name = player1.value.trim() || "Player 1";
      const player2Name = player2.value.trim() || "Player 2";
      player1.textContent = `${player1Name}: `;
      player2.textContent = `${player2Name}: `;
      player1ScoreDisplay.textContent = 0;
      player2ScoreDisplay.textContent = 0;
      playerNamesForm.style.display = "none";
      questionsList.style.display = "none";
      quizDisplay.style.display = "block";
      startQuiz(); //Start the quiz logic
    });


    //Function to start the quiz
    function startQuiz() {
      displayNextQuestion();
      form.style.display = 'none';
    }

    //Function to update the current player

function updateCurrentPlayerDisplay() {
    if (currentPlayer === 1) {
        currentPlayerDisplay.textContent = `NOW PLAY ${player1.textContent.trim() || "Player 1"}`;
    } else {
        currentPlayerDisplay.textContent = `NOW PLAY ${player2.textContent.trim() || "Player 2"}`;
    }
}


     

//Function to display the next question
    function displayNextQuestion() {
      if (currentQuestionIndex < quizQuestions.length) {
        const question = quizQuestions[currentQuestionIndex];
        displayQuestion(question, currentQuestionIndex + 1);
      } else {
        if (currentPlayer === 1) {
          currentPlayer = 2;
          currentQuestionIndex = 0;
          displayNextQuestion();
        } else {
          displayFinalScores();
        }
      }
      updateCurrentPlayerDisplay();
    }

    //Function to display a questions in the quiz
    function displayQuestion(question, questionNumber) {
      quizDisplay.innerHTML = '';

      const listItem = document.createElement('li');
      listItem.className = 'question-list-in-quiz-game';
      const questionText = document.createElement('p');
      questionText.className = 'question-text-in-quiz-game';
      questionText.textContent = `Question ${questionNumber}: ${question.question}`;
      listItem.appendChild(questionText);

      const optionsList = document.createElement('ul');
      optionsList.className = 'options-list-in-quiz-game';
      question.options.forEach((option, i) => {
        const optionItem = document.createElement('li');
        optionItem.className = 'option-item-in-quiz-game';
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button-in-quiz-game';
        optionButton.textContent = `${option.text}`;
        optionButton.addEventListener('click', function () {
          handleAnswerClick(i, question.correctIndex, optionsList);
        });
        optionItem.appendChild(optionButton);
        optionsList.appendChild(optionItem);
      });
      listItem.appendChild(optionsList);

      quizDisplay.appendChild(listItem);
    }

 // Function to handle a user's answer click
 function handleAnswerClick(selectedIndex, correctIndex, optionsList) {
    const isCorrect = selectedIndex === correctIndex;
  
    // Highlight the selected option
    const selectedOptionItem = optionsList.children[selectedIndex];
    const optionButton = selectedOptionItem.querySelector('.option-button-in-quiz-game');
    
    // Change the button color based on correctness
    optionButton.style.backgroundColor = isCorrect ? 'green' : 'red';
  
    // Highlight the correct answer
    const correctOptionItem = optionsList.children[correctIndex];
    const correctOptionButton = correctOptionItem.querySelector('.option-button-in-quiz-game');
    correctOptionButton.style.backgroundColor = 'green';
  
    if (isCorrect) {
      currentPlayer === 1 ? player1ScoreDisplay.textContent++ : player2ScoreDisplay.textContent++;
    }

      setTimeout(() => {
        // Reset styles for the next question
        selectedOptionItem.classList.remove('correct', 'incorrect');
        correctOptionItem.classList.remove('correct', 'incorrect');
        currentQuestionIndex++;
        displayNextQuestion();
        updateCurrentPlayerDisplay();
      }, 2000);
    }

    //Function to display final scores
    function displayFinalScores() {
      quizDisplay.innerHTML = '';

      const finalScoresHeading = document.createElement('h2');
      finalScoresHeading.className = 'final-scores-heading';
      finalScoresHeading.textContent = 'Final Scores';
      quizDisplay.appendChild(finalScoresHeading);
      addTrophyImg();

      const player1Result = document.createElement('p');
      player1Result.className = 'player1-score-text';
      player1Result.textContent = `${player1.textContent} has received ${player1ScoreDisplay.textContent} points.`;
      quizDisplay.appendChild(player1Result);

      const player2Result = document.createElement('p');
      player2Result.className = 'player2-score-text';
      player2Result.textContent = `${player2.textContent} has received ${player2ScoreDisplay.textContent} points.`;
      quizDisplay.appendChild(player2Result);

      let winnerText = '';
      const player1Score = parseInt(player1ScoreDisplay.textContent);
      const player2Score = parseInt(player2ScoreDisplay.textContent);
      
      if (player1Score > player2Score) {
        winnerText = `${player1.textContent} is the winner!`;
      } else if (player2Score > player1Score) {
        winnerText = `${player2.textContent} is the winner!`;
      } else {
        winnerText = 'It\'s a tie!';
      }

      const winnerAnnouncement = document.createElement('h3');
      winnerAnnouncement.className = 'winner-announcement-heading';
      winnerAnnouncement.textContent = winnerText;
      quizDisplay.appendChild(winnerAnnouncement);
      currentPlayerDisplay.style.display = 'none';
 
    }

    //Function to display  a messege dialog
    function showDialog(message) {
      dialog.textContent = message;
      dialog.showModal();
      setTimeout(() => dialog.close(), 2000);
    }

    //Event listener for form submission and adding a new question
    form.addEventListener('submit', function (event) {
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
      form.reset();
      displayQuestionList();
    });

    //Function to create a reveal button
    function createRevealButton(index) {
        const revealButton = document.createElement('button');
        revealButton.className = 'reveal-button';
        revealButton.textContent = 'Reveal Correct Answer';
        revealButton.addEventListener('click', function () {
            const correctIndex = quizQuestions[index].correctIndex;
            alert(`The correct answer for Question ${index + 1} is Option ${correctIndex + 1}`);
        });
        return revealButton;
    }

    //Function to display  list of questions after form submission
    function displayQuestionList() {
      questionsList.innerHTML = '';

      quizQuestions.forEach((question, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'question-item';
        const questionText = document.createElement('p');
        questionText.className = 'question-text';
        questionText.textContent = ` ${index + 1}. ${question.question}`;
        listItem.appendChild(questionText);

        const optionsList = document.createElement('ul');
        optionsList.className = 'options-list';
        question.options.forEach((option, i) => {
          const optionItem = document.createElement('li');
          optionItem.className = 'option-item';
          optionItem.textContent = ` ${i + 1}. ${option.text}`;
          optionsList.appendChild(optionItem);
        });
        listItem.appendChild(optionsList);
const revealButton = createRevealButton(index);
        questionsList.appendChild(listItem);
        listItem.appendChild(revealButton);
      });
    }

     // Filter questions based on the content of the question
     function filterQuestions(searchTerm) {
        const filteredQuestions = quizQuestions.filter(question =>
            question.question.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayFilteredQuestions(filteredQuestions);
    }

      // Display filtered questions
      function displayFilteredQuestions(filteredQuestions) {
        questionsList.innerHTML = '';

        filteredQuestions.forEach((question, index) => {
            const listItem = document.createElement('li');
            const questionText = document.createElement('p');
            questionText.textContent = `Question ${index + 1}: ${question.question}`;
            listItem.appendChild(questionText);

            const optionsList = document.createElement('ul');
            question.options.forEach((option, i) => {
                const optionItem = document.createElement('li');
                optionItem.textContent = ` ${option.text}`;
                optionsList.appendChild(optionItem);
            });
            listItem.appendChild(optionsList);

            const revealButton = createRevealButton(index);
            listItem.appendChild(revealButton);

            questionsList.appendChild(listItem);
        });
    }

  // Add event listener for filter input
  const filterInput = document.getElementById('searchInput');
  filterInput.addEventListener('input', function () {
      filterQuestions(this.value);
  });
displayQuestionList();

function addTrophyImg(){
    const trophyImg= document.createElement('img');
    trophyImg.src = "img/gift.jpg";
    trophyImg.alt = "Trophy";
    trophyImg.className = "trophy-img";

    quizDisplay.appendChild(trophyImg);
}
  });