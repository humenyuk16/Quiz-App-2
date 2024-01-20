document.addEventListener("DOMContentLoaded", function () {
    //Elements
    let quizQuestions = [];
    const firstPage = document.getElementById('first-page');
    const openTheForm = document.getElementById("quiz-create-btn");
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

    openTheForm.addEventListener('click', function () {
      form.scrollIntoView({ behavior: 'smooth' });
    });

  // Fetching data from the JSON file
 /*  fetch('https://raw.githubusercontent.com/humenyuk16/humenyuk16.github.io/main/questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      quizQuestions = data;
      displayQuestionList();
      
    })
    .catch(error => {
      console.error('Error:', error);
    }); */

    async function fetchData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/humenyuk16/humenyuk16.github.io/main/questions.json');
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        quizQuestions = data;
        displayQuestionList();
      } catch (error) {
        console.error('Error:', error);
      }
    }  
    // Call the async function
    fetchData();
       

// Add event listener for sorting options
const sortingSelect = document.getElementById('sortingSelect');
sortingSelect.addEventListener('change', function () {
  const selectedOption = sortingSelect.value;
  if (selectedOption === 'alphabetical') {
    quizQuestions.sort((a, b) => a.question.localeCompare(b.question));
  } else if (selectedOption === 'random') {
    quizQuestions.sort(() => Math.random() - 0.5);
  }
  
  displayNextQuestion();
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

    // Function to hide elements
function hideElements() {
    quizListContainer.style.display = 'none';
    firstPage.style.display = 'none';
  }
  
  // Function to set player names and display relevant elements
  function setPlayersNames() {
    const player1Name = player1.value.trim() || "Player 1";
    const player2Name = player2.value.trim() || "Player 2";
    player1.textContent = `${player1Name}: `;
    player2.textContent = `${player2Name}: `;
    player1ScoreDisplay.textContent = 0;
    player2ScoreDisplay.textContent = 0;
    playerNamesForm.style.display = "none";
    questionsList.style.display = "none";
    quizDisplay.style.display = "block";
  }
  
  // Event handler
  startQuizButton.addEventListener('click', function () {
    hideElements();
    setPlayersNames();
    startQuiz(); // Start the quiz logic
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
        currentQuestionIndex++;
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
      questionText.textContent = `${questionNumber}: ${question.question}`;
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

        if (option.correct) {
          question.correctIndex = i;
        }
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
    optionButton.style.backgroundColor = '';
    correctOptionButton.style.backgroundColor = '';
    displayNextQuestion();
    updateCurrentPlayerDisplay();
  }, 1500);
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
      for (let i = 0; i < 10; i++ ){
      confetti({
        particleCount: 100,
        spread: 190,
        origin: { y: 0.6 }
      }); 
      }
      setTimeout(() => {
        alert("Thank you for playing! If you want to play again, refresh the page.");
      }, 3000);
    }

    //Function to display  a messege dialog
    function showDialog(message) {
      dialog.textContent = message;
      dialog.showModal();
      setTimeout(() => dialog.close(), 1500);
    }

    //Event listener for form submission and adding a new question
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (
        form.question.value.trim() === '' ||
        form.option1.value.trim() === '' ||
        form.option2.value.trim() === '' ||
        form.option3.value.trim() === '' ||
        form.option4.value.trim() === ''
      ) {
        showDialog("Please fill in all fields before submitting the form.");
        return; // Do not proceed with form submission
      }

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
          console.log('Reveal button clicked for question', index + 1);          
          const questionNumber = index + 1;
          const correctAnswerText = getCorrectOptionText(quizQuestions[index]);
  
          if (correctAnswerText !== undefined) {
              const message = `The correct answer for Question ${questionNumber} is: ${correctAnswerText}`;
              alert(message);
          } else {
              const errorMessage = `Correct answer for Question ${questionNumber} is not defined.`;
              alert(errorMessage);
          }
        });
        return revealButton;
    }   
    
    // Function to get the text of the correct option
    function getCorrectOptionText(question) {
      const correctOption = question.options.find(option => option.correct);
  
      if (correctOption !== undefined && correctOption !== null) {
          return correctOption.text; // For questions from JSON
      } else if (question.correctIndex !== undefined && question.correctIndex !== null) {
          const correctOptionIndex = question.correctIndex;
          return `Option ${correctOptionIndex + 1}`; // For questions added from form
      } else {
          return undefined;
      }
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